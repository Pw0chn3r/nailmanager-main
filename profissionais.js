const API_URL = "http://localhost:3000/profissionais";

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

// CARREGAR SERVIÇOS NO SELECT
async function carregarServicos() {
    try {
        const resposta = await fetch("http://localhost:3000/servicos");
        const servicos = await resposta.json();

        const select = document.getElementById("servico_id");
        select.innerHTML = `<option value="">Selecione o serviço</option>`;

        if (servicos.length === 0) {
            abrirModalAviso("Cadastre um serviço antes de cadastrar profissionais.");
            return;
        }

        servicos.forEach(servico => {
            select.innerHTML += `
                <option value="${servico.id}">${servico.nome}</option>
            `;
        });
    } catch (erro) {
        console.error("Erro ao carregar serviços:", erro);
        abrirModalAviso("Erro ao carregar serviços");
    }
}

// CARREGAR PROFISSIONAIS DO BANCO
async function carregarProfissionais() {
    try {
        const resposta = await fetch(API_URL);
        const profissionais = await resposta.json();
        atualizarTabela(profissionais);
    } catch (erro) {
        console.error("Erro ao carregar profissionais:", erro);
        abrirModalAviso("Erro ao carregar profissionais");
    }
}

// CADASTRAR PROFISSIONAL
async function cadastrarProfissional(event) {
    event.preventDefault();

    const profissional = {
        nome: document.getElementById("nome").value,
        telefone: document.getElementById("telefone").value,
        email: document.getElementById("email").value,
        cpf: document.getElementById("cpf").value,
        servico_id: document.getElementById("servico_id").value,
        nascimento: document.getElementById("nascimento").value
    };

    try {
        const resposta = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(profissional)
        });

        if (!resposta.ok) {
            throw new Error("Erro ao cadastrar profissional");
        }

        document.getElementById("formProfissional").reset();
        fecharFormulario();
        carregarProfissionais();
    } catch (erro) {
        console.error("Erro:", erro);
        abrirModalAviso("Erro ao cadastrar profissional");
    }
}

// ATUALIZAR TABELA
function atualizarTabela(profissionais) {
    const tabela = document.getElementById("listaProfissionais");
    tabela.innerHTML = "";

    profissionais.forEach((profissional) => {
        tabela.innerHTML += `
            <tr>
                <td>${profissional.nome}</td>
                <td>${profissional.telefone}</td>
                <td>${profissional.email}</td>
                <td>${profissional.cpf}</td>
                <td>${profissional.especialidade}</td>
                <td>${formatarData(profissional.nascimento)}</td>
                <td>
                    <button class="btn-excluir" onclick="removerProfissional(${profissional.id})">
                        Excluir
                    </button>
                </td>
            </tr>
        `;
    });

    document.getElementById("totalProfissionais").innerText = profissionais.length;
}

// REMOVER PROFISSIONAL
function removerProfissional(id) {
    abrirModalConfirmacao("Deseja realmente excluir este profissional?", async () => {
        try {
            const resposta = await fetch(`${API_URL}/${id}`, {
                method: "DELETE"
            });

            if (!resposta.ok) {
                throw new Error("Erro ao excluir profissional");
            }

            await carregarProfissionais();
            fecharModal();

        } catch (erro) {
            console.error("Erro:", erro);
            abrirModalAviso("Erro ao excluir profissional");
        }
    });
}

// BUSCAR PROFISSIONAL
function buscarProfissional() {
    const termo = document.getElementById("busca").value.toLowerCase();
    const linhas = document.querySelectorAll("#listaProfissionais tr");

    linhas.forEach((linha) => {
        const nome = linha.children[0].innerText.toLowerCase();
        const especialidade = linha.children[4].innerText.toLowerCase();
        const email = linha.children[2].innerText.toLowerCase();

        linha.style.display =
            nome.includes(termo) ||
            especialidade.includes(termo) ||
            email.includes(termo)
                ? ""
                : "none";
    });
}

// FORMATAR DATA
function formatarData(dataISO) {
    if (!dataISO) return "";
    return dataISO.split("T")[0].split("-").reverse().join("/");
}

// CARREGAR AO ABRIR A PÁGINA
document.addEventListener("DOMContentLoaded", async () => {
    await carregarServicos();
    await carregarProfissionais();
});

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

function fecharModal() {
    const modal = document.getElementById("modalConfirmacao");
    const botaoCancelar = document.querySelector(".btn-cancelar-modal");
    const botaoConfirmar = document.getElementById("btnConfirmarModal");

    modal.classList.remove("ativo");

    botaoCancelar.style.display = "inline-block";
    botaoConfirmar.innerText = "Excluir";

    acaoConfirmada = null;
}