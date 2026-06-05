const Estoque = require("../models/estoqueModel");

exports.listar = (req, res) => {
    Estoque.listarTodos((erro, resultado) => {
        if (erro) {
            return res.status(500).json({ erro: "Erro ao listar produtos" });
        }

        res.json(resultado);
    });
};

exports.buscar = (req, res) => {
    const { id } = req.params;

    Estoque.buscarPorId(id, (erro, resultado) => {
        if (erro) {
            return res.status(500).json({ erro: "Erro ao buscar produto" });
        }

        if (resultado.length === 0) {
            return res.status(404).json({ mensagem: "Produto não encontrado" });
        }

        res.json(resultado[0]);
    });
};

exports.criar = (req, res) => {
    Estoque.criar(req.body, (erro, resultado) => {
        if (erro) {
            return res.status(500).json({ erro: "Erro ao cadastrar produto" });
        }

        res.status(201).json({
            mensagem: "Produto cadastrado com sucesso",
            id: resultado.insertId
        });
    });
};

exports.atualizar = (req, res) => {
    const { id } = req.params;

    Estoque.atualizar(id, req.body, (erro) => {
        if (erro) {
            return res.status(500).json({ erro: "Erro ao atualizar produto" });
        }

        res.json({ mensagem: "Produto atualizado com sucesso" });
    });
};

exports.deletar = (req, res) => {
    const { id } = req.params;

    Estoque.deletar(id, (erro) => {
        if (erro) {
            return res.status(500).json({ erro: "Erro ao excluir produto" });
        }

        res.json({ mensagem: "Produto excluído com sucesso" });
    });
};