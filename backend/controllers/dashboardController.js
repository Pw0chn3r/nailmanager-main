const Dashboard = require("../models/dashboardModel");

exports.resumo = async (req, res) => {
    Dashboard.buscarResumo((erro, resultado) => {
        if (erro) {
            console.log(erro);
            return res.status(500).json({ erro: "Erro ao carregar dashboard" });
        }

        res.json(resultado);
    });
};