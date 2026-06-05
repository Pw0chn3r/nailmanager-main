const conexao = require("../db");

exports.listarTodos = (callback) => {
    const sql = `
        SELECT 
            profissionais.id,
            profissionais.nome,
            profissionais.telefone,
            profissionais.email,
            profissionais.cpf,
            profissionais.servico_id,
            servicos.nome AS especialidade,
            profissionais.nascimento
        FROM profissionais
        INNER JOIN servicos ON profissionais.servico_id = servicos.id
    `;

    conexao.query(sql, callback);
};

exports.buscarPorId = (id, callback) => {
    conexao.query("SELECT * FROM profissionais WHERE id = ?", [id], callback);
};

exports.criar = (dados, callback) => {
    const { nome, telefone, email, cpf, servico_id, nascimento } = dados;

    const sql = `
        INSERT INTO profissionais 
        (nome, telefone, email, cpf, servico_id, nascimento)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    conexao.query(sql, [nome, telefone, email, cpf, servico_id, nascimento], callback);
};

exports.atualizar = (id, dados, callback) => {
    const { nome, telefone, email, cpf, especialidade, nascimento } = dados;

    const sql = `
        UPDATE profissionais
        SET nome = ?, telefone = ?, email = ?, cpf = ?, especialidade = ?, nascimento = ?
        WHERE id = ?
    `;

    conexao.query(
        sql,
        [nome, telefone, email, cpf, especialidade, nascimento, id],
        callback
    );
};

exports.deletar = (id, callback) => {
    conexao.query("DELETE FROM profissionais WHERE id = ?", [id], callback);
};