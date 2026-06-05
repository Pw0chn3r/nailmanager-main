const conexao = require("../db");

exports.listarContasReceber = (callback) => {
    const sql = `
        SELECT 
            financeiro.id,
            financeiro.agenda_id,
            clientes.nome AS cliente,
            profissionais.nome AS profissional,
            servicos.nome AS servico,
            servicos.comissao,
            financeiro.valor,
            agenda.data,
            agenda.status AS status_agenda,
            financeiro.status_financeiro
        FROM financeiro
        INNER JOIN agenda ON financeiro.agenda_id = agenda.id
        INNER JOIN clientes ON agenda.cliente_id = clientes.id
        INNER JOIN profissionais ON agenda.profissional_id = profissionais.id
        INNER JOIN servicos ON agenda.servico_id = servicos.id
        WHERE financeiro.status_financeiro IN ('A receber', 'Pendente')
        ORDER BY agenda.data DESC
    `;

    conexao.query(sql, callback);
};

exports.listarRecebidos = (callback) => {
    const sql = `
        SELECT 
            financeiro.id,
            clientes.nome AS cliente,
            profissionais.nome AS profissional,
            servicos.nome AS servico,
            servicos.comissao,
            financeiro.valor,
            (financeiro.valor * servicos.comissao / 100) AS valor_comissao,
            (financeiro.valor - (financeiro.valor * servicos.comissao / 100)) AS valor_empresa,
            financeiro.forma_pagamento,
            financeiro.data_pagamento,
            financeiro.status_financeiro
        FROM financeiro
        INNER JOIN agenda ON financeiro.agenda_id = agenda.id
        INNER JOIN clientes ON agenda.cliente_id = clientes.id
        INNER JOIN profissionais ON agenda.profissional_id = profissionais.id
        INNER JOIN servicos ON agenda.servico_id = servicos.id
        WHERE financeiro.status_financeiro = 'Pago'
        ORDER BY financeiro.data_pagamento DESC
    `;

    conexao.query(sql, callback);
};

exports.darBaixa = (id, dados, callback) => {
    const { forma_pagamento, status_financeiro, data_pagamento, observacoes } = dados;

    const sql = `
        UPDATE financeiro
        SET forma_pagamento = ?, status_financeiro = ?, data_pagamento = ?, observacoes = ?
        WHERE id = ?
    `;

    conexao.query(sql, [forma_pagamento, status_financeiro, data_pagamento, observacoes, id], callback);
};

exports.relatorio = (callback) => {
    const sql = `
        SELECT
            SUM(CASE WHEN status_financeiro = 'Pago' THEN valor ELSE 0 END) AS total_recebido,
            SUM(CASE WHEN status_financeiro IN ('A receber', 'Pendente') THEN valor ELSE 0 END) AS total_a_receber,
            COUNT(CASE WHEN status_financeiro = 'Pago' THEN 1 END) AS atendimentos_pagos,
            COUNT(CASE WHEN status_financeiro IN ('A receber', 'Pendente') THEN 1 END) AS atendimentos_pendentes
        FROM financeiro
    `;

    conexao.query(sql, callback);
};