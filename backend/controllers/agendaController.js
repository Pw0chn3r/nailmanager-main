const Agenda = require("../models/agendaModel");

exports.listar = (req, res) => {
    Agenda.listarTodos((erro, resultado) => {
        if (erro) {
            return res.status(500).json({ erro: "Erro ao listar agendamentos" });
        }

        res.json(resultado);
    });
};

exports.buscar = (req, res) => {
    const { id } = req.params;

    Agenda.buscarPorId(id, (erro, resultado) => {
        if (erro) {
            return res.status(500).json({ erro: "Erro ao buscar agendamento" });
        }

        if (resultado.length === 0) {
            return res.status(404).json({ mensagem: "Agendamento não encontrado" });
        }

        res.json(resultado[0]);
    });
};

exports.criar = (req, res) => {
    Agenda.criar(req.body, (erro, resultado) => {
        if (erro) {
            return res.status(500).json({ erro: "Erro ao cadastrar agendamento" });
        }

        res.status(201).json({
            mensagem: "Agendamento cadastrado com sucesso",
            id: resultado.insertId
        });
    });
};

exports.atualizar = (req, res) => {
    const { id } = req.params;

    Agenda.atualizar(id, req.body, (erro) => {
        if (erro) {
            return res.status(500).json({ erro: "Erro ao atualizar agendamento" });
        }

        res.json({ mensagem: "Agendamento atualizado com sucesso" });
    });
};

exports.deletar = (req, res) => {
    const { id } = req.params;

    Agenda.deletar(id, (erro) => {
        if (erro) {
            return res.status(500).json({ erro: "Erro ao excluir agendamento" });
        }

        res.json({ mensagem: "Agendamento excluído com sucesso" });
    });
};