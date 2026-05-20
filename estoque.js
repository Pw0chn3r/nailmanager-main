const API_URL = "http://localhost:3000/estoque";

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

// CARREGAR PRODUTOS
async function carregarProdutos() {
    try {
        const resposta = await fetch(API_URL);
        const produtos = await resposta.json();

        atualizarTabela(produtos);
    } catch (erro) {
        console.error("Erro ao carregar produtos:", erro);
        abrirModalAviso("Erro ao carregar produtos");
    }
}

// CADASTRAR PRODUTO
async function cadastrarProduto(event) {
    event.preventDefault();

    const produto = {
        nome: document.getElementById("nome").value,
        categoria: document.getElementById("categoria").value,
        marca: document.getElementById("marca").value,
        quantidade: document.getElementById("quantidade").value,
        preco_compra: document.getElementById("preco_compra").value,
        quantidade_minima: document.getElementById("quantidade_minima").value,
        validade: document.getElementById("validade").value,
        status: document.getElementById("status").value,
        descricao: document.getElementById("descricao").value
    };

    try {
        const resposta = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(produto)
        });

        if (!resposta.ok) {
            throw new Error("Erro ao cadastrar produto");
        }

        document.getElementById("formEstoque").reset();
        fecharFormulario();
        carregarProdutos();

    } catch (erro) {
        console.error("Erro:", erro);
        abrirModalAviso("Erro ao cadastrar produto");
    }
}

// ATUALIZAR TABELA
function atualizarTabela(produtos) {
    const tabela = document.getElementById("listaProdutos");
    tabela.innerHTML = "";

    produtos.forEach((produto) => {
        tabela.innerHTML += `
            <tr>
                <td>${produto.nome}</td>
                <td>${produto.categoria}</td>
                <td>${produto.marca}</td>
                <td>${produto.quantidade}</td>
                <td>R$ ${formatarPreco(produto.preco_compra)}</td>
                <td>${formatarData(produto.validade)}</td>
                <td>${produto.status}</td>
                <td>
                    <button class="btn-excluir" onclick="removerProduto(${produto.id})">
                        Excluir
                    </button>
                </td>
            </tr>
        `;
    });

    document.getElementById("totalProdutos").innerText = produtos.length;
}

// REMOVER PRODUTO
function removerProduto(id) {
    abrirModalConfirmacao(
        "Deseja realmente excluir este produto?",
        async () => {
            try {
                const resposta = await fetch(`${API_URL}/${id}`, {
                    method: "DELETE"
                });

                if (!resposta.ok) {
                    throw new Error("Erro ao excluir produto");
                }

                await carregarProdutos();
                fecharModal();

            } catch (erro) {
                console.error("Erro:", erro);
                abrirModalAviso("Erro ao excluir produto");
            }
        }
    );
}

// BUSCAR PRODUTO
function buscarProduto() {
    const termo = document.getElementById("busca").value.toLowerCase();
    const linhas = document.querySelectorAll("#listaProdutos tr");

    linhas.forEach((linha) => {
        const nome = linha.children[0].innerText.toLowerCase();
        const categoria = linha.children[1].innerText.toLowerCase();
        const marca = linha.children[2].innerText.toLowerCase();

        linha.style.display =
            nome.includes(termo) ||
            categoria.includes(termo) ||
            marca.includes(termo)
                ? ""
                : "none";
    });
}

// FORMATAR PREÇO
function formatarPreco(valor) {
    return Number(valor).toFixed(2).replace(".", ",");
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
document.addEventListener("DOMContentLoaded", carregarProdutos);