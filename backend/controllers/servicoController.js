const Servico = require("../models/servicoModel");

exports.listar = (req, res) => {
    Servico.listarTodos((erro, resultado) => {
        if (erro) {
            return res.status(500).json({ erro: "Erro ao listar serviços" });
        }

        res.json(resultado);
    });
};

exports.buscar = (req, res) => {
    const { id } = req.params;

    Servico.buscarPorId(id, (erro, resultado) => {
        if (erro) {
            return res.status(500).json({ erro: "Erro ao buscar serviço" });
        }

        if (resultado.length === 0) {
            return res.status(404).json({ mensagem: "Serviço não encontrado" });
        }

        res.json(resultado[0]);
    });
};

exports.criar = (req, res) => {
    Servico.criar(req.body, (erro, resultado) => {
        if (erro) {
            return res.status(500).json({ erro: "Erro ao cadastrar serviço" });
        }

        res.status(201).json({
            mensagem: "Serviço cadastrado com sucesso",
            id: resultado.insertId
        });
    });
};

exports.atualizar = (req, res) => {
    const { id } = req.params;

    Servico.atualizar(id, req.body, (erro) => {
        if (erro) {
            return res.status(500).json({ erro: "Erro ao atualizar serviço" });
        }

        res.json({ mensagem: "Serviço atualizado com sucesso" });
    });
};

exports.deletar = (req, res) => {
    const { id } = req.params;

    Servico.deletar(id, (erro) => {
        if (erro) {
            return res.status(500).json({ erro: "Erro ao excluir serviço" });
        }

        res.json({ mensagem: "Serviço excluído com sucesso" });
    });
};