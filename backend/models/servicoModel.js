const conexao = require("../db");

exports.listarTodos = (callback) => {
    conexao.query("SELECT * FROM servicos", callback);
};

exports.buscarPorId = (id, callback) => {
    conexao.query("SELECT * FROM servicos WHERE id = ?", [id], callback);
};

exports.criar = (dados, callback) => {
    const { nome, preco, duracao, categoria, descricao, status, comissao } = dados;

    const sql = `
        INSERT INTO servicos (nome, preco, duracao, categoria, descricao, status, comissao)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    conexao.query(sql, [nome, preco, duracao, categoria, descricao, status, comissao], callback);
};

exports.atualizar = (id, dados, callback) => {
    const { nome, preco, duracao, categoria, descricao, status, comissao } = dados;

    const sql = `
        UPDATE servicos
        SET nome = ?, preco = ?, duracao = ?, categoria = ?, descricao = ?, status = ?, comissao = ?
        WHERE id = ?
    `;

    conexao.query(sql, [nome, preco, duracao, categoria, descricao, status, comissao, id], callback);
};

exports.deletar = (id, callback) => {
    conexao.query("DELETE FROM servicos WHERE id = ?", [id], callback);
};