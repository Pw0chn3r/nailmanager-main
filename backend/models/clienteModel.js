const conexao = require("../db");

exports.listarTodos = (callback) => {
    conexao.query("SELECT * FROM clientes", callback);
};

exports.buscarPorId = (id, callback) => {
    conexao.query("SELECT * FROM clientes WHERE id=?", [id], callback);
};

exports.criar = (dados, callback) => {
    const { nome, telefone, email, cpf, nascimento } = dados;

    const sql = `
        INSERT INTO clientes (nome, telefone, email, cpf, nascimento)
        VALUES (?, ?, ?, ?, ?)
    `;

    conexao.query(sql, [nome, telefone, email, cpf, nascimento], callback);
};

exports.atualizar = (id, dados, callback) => {
    const { nome, telefone, email, cpf, nascimento } = dados;

    const sql = `
        UPDATE clientes
        SET nome=?, telefone=?, email=?, cpf=?, nascimento=?
        WHERE id=?
    `;

    conexao.query(sql, [nome, telefone, email, cpf, nascimento, id], callback);
};

exports.deletar = (id, callback) => {
    conexao.query("DELETE FROM clientes WHERE id=?", [id], callback);
};