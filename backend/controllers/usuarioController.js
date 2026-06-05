const Usuario = require("../models/usuarioModel");

exports.cadastrar = (req, res) => {
    const { nome, email, senha } = req.body;

    Usuario.buscarPorEmail(email, (erro, resultado) => {
        if (erro) return res.status(500).json({ erro: "Erro no cadastro" });

        if (resultado.length > 0) {
            return res.status(400).json({ erro: "Email já cadastrado" });
        }

        Usuario.cadastrar({ nome, email, senha }, (erro) => {
            if (erro) return res.status(500).json({ erro: "Erro ao cadastrar usuário" });

            res.status(201).json({ mensagem: "Usuário cadastrado com sucesso" });
        });
    });
};

exports.login = (req, res) => {
    const { email, senha } = req.body;

    Usuario.buscarPorEmail(email, (erro, resultado) => {
        if (erro) return res.status(500).json({ erro: "Erro no login" });

        if (resultado.length === 0) {
            return res.status(401).json({ erro: "Email ou senha incorretos" });
        }

        const usuario = resultado[0];

        if (usuario.senha !== senha) {
            return res.status(401).json({ erro: "Email ou senha incorretos" });
        }

        res.json({
            mensagem: "Login realizado com sucesso",
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email
            }
        });
    });
};