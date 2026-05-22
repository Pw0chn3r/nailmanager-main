const API_URL = "http://localhost:3000/clientes";

// MENU ESQUERDO
function toggleMenu() {
    document.getElementById("sidebar").classList.toggle("recolhido");
}

// ABRIR FORMULÁRIO
function abrirFormulario() {
    document.getElementById("painelDireito").classList.add("aberto");
}

// FECHAR FORMULÁRIO
function fecharFormulario() {
    document.getElementById("painelDireito").classList.remove("aberto");
}

// CARREGAR CLIENTES
async function carregarClientes() {
    try {
        const resposta = await fetch(API_URL);
        const clientes = await resposta.json();

        atualizarTabela(clientes);
    } catch (erro) {
        console.error("Erro ao carregar clientes:", erro);
        abrirModalAviso("Erro ao carregar clientes");
    }
}

// CADASTRAR CLIENTE
async function cadastrarCliente(event) {
    event.preventDefault();

    const cliente = {
        nome: document.getElementById("nome").value,
        telefone: document.getElementById("telefone").value,
        email: document.getElementById("email").value,
        cpf: document.getElementById("cpf").value,
        nascimento: document.getElementById("nascimento").value
    };

    try {
        const resposta = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(cliente)
        });

        if (!resposta.ok) {
            throw new Error("Erro ao cadastrar");
        }

        fecharFormulario();
        document.getElementById("formCliente").reset();
        carregarClientes();

    } catch (erro) {
        console.error("Erro:", erro);
        abrirModalAviso("Erro ao cadastrar cliente");
    }
}

// ATUALIZAR TABELA
function atualizarTabela(clientes) {
    const tabela = document.getElementById("listaClientes");
    tabela.innerHTML = "";

    clientes.forEach(cliente => {
        tabela.innerHTML += `
            <tr>
                <td>${cliente.nome}</td>
                <td>${cliente.telefone}</td>
                <td>${cliente.email}</td>
                <td>${cliente.cpf}</td>
                <td>${formatarData(cliente.nascimento)}</td>
                <td>
                    <button class="btn-excluir" onclick="removerCliente(${cliente.id})">
                        Excluir
                    </button>
                </td>
            </tr>
        `;
    });

    document.getElementById("totalClientes").innerText = clientes.length;
}

// REMOVER CLIENTE
function removerCliente(id) {
    abrirModalConfirmacao(
        "Deseja realmente excluir este cliente?",
        async () => {
            try {
                const resposta = await fetch(`${API_URL}/${id}`, {
                    method: "DELETE"
                });

                if (!resposta.ok) {
                    throw new Error("Erro ao excluir");
                }

                await carregarClientes();
                fecharModal();

            } catch (erro) {
                console.error("Erro:", erro);
                abrirModalAviso("Erro ao excluir cliente");
            }
        }
    );
}

// BUSCAR CLIENTE
function buscarCliente() {
    const termo = document.getElementById("busca").value.toLowerCase();
    const linhas = document.querySelectorAll("#listaClientes tr");

    linhas.forEach(linha => {
        const nome = linha.children[0].innerText.toLowerCase();

        linha.style.display = nome.includes(termo)
            ? ""
            : "none";
    });
}

// FORMATAR DATA
function formatarData(dataISO) {
    if (!dataISO) return "";

    if (dataISO.includes("T")) {
        return dataISO.split("T")[0].split("-").reverse().join("/");
    }

    if (dataISO.includes("-")) {
        return dataISO.split("-").reverse().join("/");
    }

    return dataISO;
}

// MODAL DE CONFIRMAÇÃO
let acaoConfirmada = null;

function abrirModalConfirmacao(mensagem, acao) {
    const titulo = document.querySelector(".modal-caixa h3");
    const mensagemModal = document.getElementById("modalMensagem");
    const modal = document.getElementById("modalConfirmacao");
    const botaoConfirmar = document.getElementById("btnConfirmarModal");

    titulo.innerText = "Confirmar exclusão";
    mensagemModal.innerText = mensagem;
    botaoConfirmar.innerText = "Excluir";

    modal.classList.add("ativo");

    acaoConfirmada = acao;

    botaoConfirmar.onclick = async () => {
        if (acaoConfirmada) {
            await acaoConfirmada();
        }
    };
}

// MODAL DE AVISO
function abrirModalAviso(mensagem) {
    const titulo = document.querySelector(".modal-caixa h3");
    const mensagemModal = document.getElementById("modalMensagem");
    const modal = document.getElementById("modalConfirmacao");
    const botaoConfirmar = document.getElementById("btnConfirmarModal");
    const botaoCancelar = document.querySelector(".btn-cancelar-modal");

    titulo.innerText = "Aviso";
    mensagemModal.innerText = mensagem;
    botaoConfirmar.innerText = "OK";

    botaoCancelar.style.display = "none";
    modal.classList.add("ativo");

    botaoConfirmar.onclick = () => {
        botaoCancelar.style.display = "inline-block";
        botaoConfirmar.innerText = "Excluir";
        fecharModal();
    };
}

// FECHAR MODAL
function fecharModal() {
    const modal = document.getElementById("modalConfirmacao");
    const botaoCancelar = document.querySelector(".btn-cancelar-modal");
    const botaoConfirmar = document.getElementById("btnConfirmarModal");

    modal.classList.remove("ativo");

    botaoCancelar.style.display = "inline-block";
    botaoConfirmar.innerText = "Excluir";

    acaoConfirmada = null;
}

// CARREGAR AO ABRIR
document.addEventListener("DOMContentLoaded", carregarClientes);

// =========================
// MODO ESCURO
// =========================

function alternarTema() {

    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
        localStorage.setItem("tema", "dark");
    } else {
        localStorage.setItem("tema", "light");
    }
}

// CARREGAR TEMA SALVO

document.addEventListener("DOMContentLoaded", () => {

    const temaSalvo = localStorage.getItem("tema");

    if (temaSalvo === "dark") {
        document.body.classList.add("dark");
    }
});