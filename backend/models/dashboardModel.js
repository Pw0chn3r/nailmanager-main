const conexao = require("../db");

exports.buscarResumo = (callback) => {
    const dados = {};

    conexao.query("SELECT COUNT(*) AS total FROM clientes", (erro, clientes) => {
        if (erro) return callback(erro);

        dados.totalClientes = clientes[0].total;

        conexao.query(`
            SELECT COUNT(*) AS total 
            FROM agenda 
            WHERE data = CURDATE()
        `, (erro, agendaHoje) => {
            if (erro) return callback(erro);

            dados.agendaHoje = agendaHoje[0].total;

            conexao.query(`
                SELECT IFNULL(SUM(valor), 0) AS total 
                FROM financeiro 
                WHERE status_financeiro = 'Pago'
                AND MONTH(data_pagamento) = MONTH(CURDATE())
                AND YEAR(data_pagamento) = YEAR(CURDATE())
            `, (erro, faturamentoMes) => {
                if (erro) return callback(erro);

                dados.faturamentoMes = faturamentoMes[0].total;

                conexao.query(`
                    SELECT COUNT(*) AS total 
                    FROM agenda 
                    WHERE status = 'Concluído'
                `, (erro, servicosRealizados) => {
                    if (erro) return callback(erro);

                    dados.servicosRealizados = servicosRealizados[0].total;

                    conexao.query(`
                        SELECT 
                            MONTH(data_pagamento) AS mes,
                            SUM(valor) AS total
                        FROM financeiro
                        WHERE status_financeiro = 'Pago'
                        GROUP BY MONTH(data_pagamento)
                        ORDER BY mes
                    `, (erro, faturamentoMensal) => {
                        if (erro) return callback(erro);

                        dados.faturamentoMensal = faturamentoMensal;

                        conexao.query(`
                            SELECT 
                                servicos.nome AS servico,
                                COUNT(*) AS total
                            FROM agenda
                            INNER JOIN servicos ON agenda.servico_id = servicos.id
                            GROUP BY servicos.nome
                            ORDER BY total DESC
                            LIMIT 5
                        `, (erro, servicosMaisRealizados) => {
                            if (erro) return callback(erro);

                            dados.servicosMaisRealizados = servicosMaisRealizados;

                            conexao.query(`
                                SELECT 
                                    HOUR(horario) AS hora,
                                    COUNT(*) AS total
                                FROM agenda
                                GROUP BY HOUR(horario)
                                ORDER BY total DESC
                                LIMIT 5
                            `, (erro, horariosMaisProcurados) => {
                                if (erro) return callback(erro);

                                dados.horariosMaisProcurados = horariosMaisProcurados;

                                conexao.query(`
                                    SELECT 
                                        clientes.nome AS cliente,
                                        profissionais.nome AS profissional,
                                        servicos.nome AS servico,
                                        agenda.horario,
                                        agenda.status
                                    FROM agenda
                                    INNER JOIN clientes ON agenda.cliente_id = clientes.id
                                    INNER JOIN profissionais ON agenda.profissional_id = profissionais.id
                                    INNER JOIN servicos ON agenda.servico_id = servicos.id
                                    WHERE agenda.data = CURDATE()
                                    ORDER BY agenda.horario
                                `, (erro, agendaDoDia) => {
                                    if (erro) return callback(erro);

                                    dados.agendaDoDia = agendaDoDia;

                                    conexao.query(`
                                        SELECT nome, quantidade, quantidade_minima
                                        FROM estoque
                                        WHERE quantidade <= quantidade_minima
                                    `, (erro, estoqueBaixo) => {
                                        if (erro) return callback(erro);

                                        dados.estoqueBaixo = estoqueBaixo;

                                        callback(null, dados);
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
};