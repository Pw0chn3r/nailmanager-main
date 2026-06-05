const mysql = require("mysql2");

const conexao = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "nailmanager",
    port: 3307
});

conexao.connect((erro) => {
    if (erro) {
        console.log("Erro ao conectar no banco:", erro);
    } else {
        console.log("Conectado ao MySQL com sucesso!");
    }
});

module.exports = conexao;