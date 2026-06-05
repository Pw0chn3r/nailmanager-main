const conexao = require("../db");

exports.listarTodos = (callback) => {
    const sql = `
        SELECT 
            agenda.id,
            agenda.cliente_id,
            agenda.profissional_id,
            agenda.servico_id,
            clientes.nome AS cliente,
            profissionais.nome AS profissional,
            servicos.nome AS servico,
            agenda.data,
            agenda.horario,
            agenda.status,
            agenda.observacoes
        FROM agenda
        INNER JOIN clientes ON agenda.cliente_id = clientes.id
        INNER JOIN profissionais ON agenda.profissional_id = profissionais.id
        INNER JOIN servicos ON agenda.servico_id = servicos.id
        ORDER BY agenda.data, agenda.horario
    `;

    conexao.query(sql, callback);
};

exports.buscarPorId = (id, callback) => {
    conexao.query("SELECT * FROM agenda WHERE id = ?", [id], callback);
};

exports.criar = (dados, callback) => {
    const { cliente_id, profissional_id, servico_id, data, horario, status, observacoes } = dados;

    const sqlAgenda = `
        INSERT INTO agenda (cliente_id, profissional_id, servico_id, data, horario, status, observacoes)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    conexao.query(sqlAgenda, [cliente_id, profissional_id, servico_id, data, horario, status, observacoes], (erro, resultadoAgenda) => {
        if (erro) return callback(erro);

        const agendaId = resultadoAgenda.insertId;

        const sqlFinanceiro = `
            INSERT INTO financeiro (agenda_id, valor, status_financeiro)
            SELECT ?, preco, 'A receber'
            FROM servicos
            WHERE id = ?
        `;

        conexao.query(sqlFinanceiro, [agendaId, servico_id], (erroFinanceiro) => {
            if (erroFinanceiro) return callback(erroFinanceiro);

            callback(null, resultadoAgenda);
        });
    });
};

exports.atualizar = (id, dados, callback) => {
    const { cliente_id, profissional_id, servico_id, data, horario, status, observacoes } = dados;

    const sql = `
        UPDATE agenda
        SET cliente_id = ?, profissional_id = ?, servico_id = ?, data = ?, horario = ?, status = ?, observacoes = ?
        WHERE id = ?
    `;

    conexao.query(sql, [cliente_id, profissional_id, servico_id, data, horario, status, observacoes, id], (erro) => {
        if (erro) return callback(erro);

        if (status === "Concluído") {
            const sqlFinanceiro = `
                UPDATE financeiro
                SET status_financeiro = 'Pendente'
                WHERE agenda_id = ? AND status_financeiro = 'A receber'
            `;

            return conexao.query(sqlFinanceiro, [id], callback);
        }

        if (status === "Cancelado") {
            const sqlFinanceiro = `
                UPDATE financeiro
                SET status_financeiro = 'Cancelado'
                WHERE agenda_id = ? AND status_financeiro != 'Pago'
            `;

            return conexao.query(sqlFinanceiro, [id], callback);
        }

        callback(null);
    });
};

exports.deletar = (id, callback) => {
    conexao.query("DELETE FROM financeiro WHERE agenda_id = ?", [id], (erro) => {
        if (erro) return callback(erro);

        conexao.query("DELETE FROM agenda WHERE id = ?", [id], callback);
    });
};