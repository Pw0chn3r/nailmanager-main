const conexao = require("../db");

exports.buscarPorEmail = (email, callback) => {
    conexao.query("SELECT * FROM usuarios WHERE email = ?", [email], callback);
};

exports.cadastrar = (dados, callback) => {
    const { nome, email, senha } = dados;

    conexao.query(
        "INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)",
        [nome, email, senha],
        callback
    );
};