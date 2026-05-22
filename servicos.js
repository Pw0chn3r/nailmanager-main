const API_URL = "http://localhost:3000/servicos";

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

// CARREGAR SERVIÇOS
async function carregarServicos() {
    try {
        const resposta = await fetch(API_URL);
        const servicos = await resposta.json();

        atualizarTabela(servicos);
    } catch (erro) {
        console.error("Erro ao carregar serviços:", erro);
        abrirModalAviso("Erro ao carregar serviços");
    }
}

// CADASTRAR SERVIÇO
async function cadastrarServico(event) {
    event.preventDefault();

    const servico = {
        nome: document.getElementById("nome").value,
        preco: document.getElementById("preco").value,
        comissao: document.getElementById("comissao").value,
        duracao: document.getElementById("duracao").value,
        categoria: document.getElementById("categoria").value,
        descricao: document.getElementById("descricao").value,
        status: document.getElementById("status").value
    };

    try {
        const resposta = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(servico)
        });

        if (!resposta.ok) {
            throw new Error("Erro ao cadastrar serviço");
        }

        document.getElementById("formServico").reset();
        fecharFormulario();
        carregarServicos();

    } catch (erro) {
        console.error("Erro:", erro);
        abrirModalAviso("Erro ao cadastrar serviço");
    }
}

// ATUALIZAR TABELA
function atualizarTabela(servicos) {
    const tabela = document.getElementById("listaServicos");
    tabela.innerHTML = "";

    servicos.forEach((servico) => {
        tabela.innerHTML += `
            <tr>
                <td>${servico.nome}</td>
                <td>${servico.categoria}</td>
                <td>R$ ${formatarPreco(servico.preco)}</td>
                <td>${servico.comissao}%</td>
                <td>${servico.duracao} min</td>
                <td>${servico.status}</td>
                <td>
    <button class="btn-ver" onclick="abrirModalDescricao('${servico.descricao || "Sem descrição"}')">
        Ver
    </button>
</td>
                <td>
                    <button class="btn-excluir" onclick="removerServico(${servico.id})">
                        Excluir
                    </button>
                </td>
            </tr>
        `;
    });

    document.getElementById("totalServicos").innerText = servicos.length;
}

// REMOVER SERVIÇO
function removerServico(id) {
    abrirModalConfirmacao(
        "Deseja realmente excluir este serviço?",
        async () => {
            try {
                const resposta = await fetch(`${API_URL}/${id}`, {
                    method: "DELETE"
                });

                if (!resposta.ok) {
                    throw new Error("Erro ao excluir serviço");
                }

                await carregarServicos();
                fecharModal();

            } catch (erro) {
                console.error("Erro:", erro);
                abrirModalAviso("Erro ao excluir serviço");
            }
        }
    );
}

// BUSCAR SERVIÇO
function buscarServico() {
    const termo = document.getElementById("busca").value.toLowerCase();
    const linhas = document.querySelectorAll("#listaServicos tr");

    linhas.forEach((linha) => {
        const nome = linha.children[0].innerText.toLowerCase();
        const categoria = linha.children[1].innerText.toLowerCase();
        const status = linha.children[5].innerText.toLowerCase();

        linha.style.display =
            nome.includes(termo) ||
            categoria.includes(termo) ||
            status.includes(termo)
                ? ""
                : "none";
    });
}

// FORMATAR PREÇO
function formatarPreco(valor) {
    return Number(valor).toFixed(2).replace(".", ",");
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
document.addEventListener("DOMContentLoaded", carregarServicos);

function abrirModalDescricao(texto) {
    const titulo = document.querySelector(".modal-caixa h3");
    const mensagemModal = document.getElementById("modalMensagem");
    const modal = document.getElementById("modalConfirmacao");
    const botaoConfirmar = document.getElementById("btnConfirmarModal");
    const botaoCancelar = document.querySelector(".btn-cancelar-modal");

    titulo.innerText = "Descrição do serviço";
    mensagemModal.innerText = texto;

    botaoConfirmar.innerText = "OK";
    botaoCancelar.style.display = "none";

    modal.classList.add("ativo");

    botaoConfirmar.onclick = () => {
        botaoCancelar.style.display = "inline-block";
        botaoConfirmar.innerText = "Excluir";
        fecharModal();
    };
}