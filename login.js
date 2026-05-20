const API_USUARIOS = "http://localhost:3000/usuarios";

function mostrarLogin() {
    document.getElementById("botoesIniciais").classList.add("oculto");
    document.getElementById("formCadastro").classList.add("oculto");
    document.getElementById("formLogin").classList.remove("oculto");
}

function mostrarCadastro() {
    document.getElementById("botoesIniciais").classList.add("oculto");
    document.getElementById("formLogin").classList.add("oculto");
    document.getElementById("formCadastro").classList.remove("oculto");
}

function voltarInicio() {
    document.getElementById("formLogin").classList.add("oculto");
    document.getElementById("formCadastro").classList.add("oculto");
    document.getElementById("botoesIniciais").classList.remove("oculto");
}

async function entrar(event) {
    event.preventDefault();

    const dados = {
        email: document.getElementById("emailLogin").value,
        senha: document.getElementById("senhaLogin").value
    };

    const resposta = await fetch(`${API_USUARIOS}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dados)
    });

    const resultado = await resposta.json();

    if (!resposta.ok) {
       abrirModalAviso(resultado.erro);
        return;
    }

    localStorage.setItem("usuarioLogado", JSON.stringify(resultado.usuario));
    window.location.href = "dashboard.html";
}

async function cadastrar(event) {
    event.preventDefault();

    const dados = {
        nome: document.getElementById("nomeCadastro").value,
        email: document.getElementById("emailCadastro").value,
        senha: document.getElementById("senhaCadastro").value
    };

    const resposta = await fetch(`${API_USUARIOS}/cadastro`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dados)
    });

    const resultado = await resposta.json();

    if (!resposta.ok) {
        abrirModalAviso(resultado.erro);
        return;
    }

   abrirModalAviso("Cadastro realizado com sucesso!");
    mostrarLogin();
}

function abrirModalAviso(mensagem) {

    document.getElementById("modalMensagem").innerText = mensagem;

    document
        .getElementById("modalConfirmacao")
        .classList.add("ativo");

    const botao = document.getElementById("btnConfirmarModal");
    const cancelar = document.querySelector(".btn-cancelar-modal");

    cancelar.style.display = "none";

    botao.innerText = "OK";

    botao.onclick = () => {
        cancelar.style.display = "inline-block";
        fecharModal();
    };
}

function fecharModal() {
    document
        .getElementById("modalConfirmacao")
        .classList.remove("ativo");
}