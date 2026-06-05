const conexao = require("../db");

exports.listarTodos = (callback) => {
    conexao.query("SELECT * FROM estoque", callback);
};

exports.buscarPorId = (id, callback) => {
    conexao.query("SELECT * FROM estoque WHERE id = ?", [id], callback);
};

exports.criar = (dados, callback) => {
    const {
        nome,
        categoria,
        marca,
        quantidade,
        preco_compra,
        quantidade_minima,
        validade,
        status,
        descricao
    } = dados;

    const sql = `
        INSERT INTO estoque (
            nome, categoria, marca, quantidade,
            preco_compra, quantidade_minima, validade,
            status, descricao
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    conexao.query(sql, [
        nome,
        categoria,
        marca,
        quantidade,
        preco_compra,
        quantidade_minima,
        validade || null,
        status,
        descricao
    ], callback);
};

exports.atualizar = (id, dados, callback) => {
    const {
        nome,
        categoria,
        marca,
        quantidade,
        preco_compra,
        quantidade_minima,
        validade,
        status,
        descricao
    } = dados;

    const sql = `
        UPDATE estoque
        SET nome = ?, categoria = ?, marca = ?, quantidade = ?,
            preco_compra = ?, quantidade_minima = ?, validade = ?,
            status = ?, descricao = ?
        WHERE id = ?
    `;

    conexao.query(sql, [
        nome,
        categoria,
        marca,
        quantidade,
        preco_compra,
        quantidade_minima,
        validade || null,
        status,
        descricao,
        id
    ], callback);
};

exports.deletar = (id, callback) => {
    conexao.query("DELETE FROM estoque WHERE id = ?", [id], callback);
};