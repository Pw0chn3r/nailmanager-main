const Profissional = require("../models/profissionalModel");

exports.listar = (req, res) => {
    Profissional.listarTodos((erro, resultado) => {
        if (erro) {
            return res.status(500).json({ erro: "Erro ao listar profissionais" });
        }

        res.json(resultado);
    });
};

exports.buscar = (req, res) => {
    const { id } = req.params;

    Profissional.buscarPorId(id, (erro, resultado) => {
        if (erro) {
            return res.status(500).json({ erro: "Erro ao buscar profissional" });
        }

        if (resultado.length === 0) {
            return res.status(404).json({ mensagem: "Profissional não encontrado" });
        }

        res.json(resultado[0]);
    });
};

exports.criar = (req, res) => {
    if (!req.body.servico_id) {
        return res.status(400).json({
            erro: "É necessário selecionar um serviço para cadastrar o profissional."
        });
    }

    Profissional.criar(req.body, (erro, resultado) => {
        if (erro) {
            return res.status(500).json({ erro: "Erro ao cadastrar profissional" });
        }

        res.status(201).json({
            mensagem: "Profissional cadastrado com sucesso",
            id: resultado.insertId
        });
    });
};

exports.atualizar = (req, res) => {
    const { id } = req.params;

    Profissional.atualizar(id, req.body, (erro) => {
        if (erro) {
            return res.status(500).json({ erro: "Erro ao atualizar profissional" });
        }

        res.json({ mensagem: "Profissional atualizado com sucesso" });
    });
};

exports.deletar = (req, res) => {
    const { id } = req.params;

    Profissional.deletar(id, (erro) => {
        if (erro) {
            return res.status(500).json({ erro: "Erro ao excluir profissional" });
        }

        res.json({ mensagem: "Profissional excluído com sucesso" });
    });
};