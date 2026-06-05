const Financeiro = require("../models/financeiroModel");

exports.contasReceber = (req, res) => {
    Financeiro.listarContasReceber((erro, resultado) => {
        if (erro) return res.status(500).json({ erro: "Erro ao listar contas a receber" });
        res.json(resultado);
    });
};

exports.recebidos = (req, res) => {
    Financeiro.listarRecebidos((erro, resultado) => {
        if (erro) return res.status(500).json({ erro: "Erro ao listar valores recebidos" });
        res.json(resultado);
    });
};

exports.darBaixa = (req, res) => {
    const { id } = req.params;

    Financeiro.darBaixa(id, req.body, (erro) => {
        if (erro) return res.status(500).json({ erro: "Erro ao dar baixa no pagamento" });
        res.json({ mensagem: "Pagamento atualizado com sucesso" });
    });
};

exports.relatorio = (req, res) => {
    Financeiro.relatorio((erro, resultado) => {
        if (erro) return res.status(500).json({ erro: "Erro ao gerar relatório financeiro" });
        res.json(resultado[0]);
    });
};