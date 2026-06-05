const Cliente = require("../models/clienteModel");

exports.listar = (req, res) => {
    Cliente.listarTodos((erro, resultado) => {
        if (erro) return res.status(500).json({ erro });
        res.json(resultado);
    });
};

exports.buscar = (req, res) => {
    const { id } = req.params;

    Cliente.buscarPorId(id, (erro, resultado) => {
        if (erro) return res.status(500).json({ erro });
        if (resultado.length === 0)
            return res.status(404).json({ mensagem: "Cliente não encontrado" });

        res.json(resultado[0]);
    });
};

exports.criar = (req, res) => {
    Cliente.criar(req.body, (erro, resultado) => {
        if (erro) return res.status(500).json({ erro });

        res.status(201).json({
            mensagem: "Cliente cadastrado com sucesso",
            id: resultado.insertId
        });
    });
};

exports.atualizar = (req, res) => {
    const { id } = req.params;

    Cliente.atualizar(id, req.body, (erro) => {
        if (erro) return res.status(500).json({ erro });

        res.json({ mensagem: "Cliente atualizado com sucesso" });
    });
};

exports.deletar = (req, res) => {
    const { id } = req.params;

    Cliente.deletar(id, (erro) => {
        if (erro) return res.status(500).json({ erro });

        res.json({ mensagem: "Cliente deletado com sucesso" });
    });
};