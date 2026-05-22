const API_URL = "http://localhost:3000/agenda";

let agendamentosGlobais = [];
let profissionalSelecionado = null;

function toggleMenu() {
    document.getElementById("sidebar").classList.toggle("recolhido");
}

function abrirFormulario() {
    document.getElementById("painelDireito").classList.add("aberto");
}

function fecharFormulario() {
    document.getElementById("painelDireito").classList.remove("aberto");
}

function mostrarAba(aba) {
    document.getElementById("abaCadastro").classList.add("oculto");
    document.getElementById("abaConsulta").classList.add("oculto");

    document.querySelectorAll(".aba").forEach(botao => {
        botao.classList.remove("ativa");
    });

    if (aba === "cadastro") {
        document.getElementById("abaCadastro").classList.remove("oculto");
        document.querySelectorAll(".aba")[0].classList.add("ativa");
    } else {
        document.getElementById("abaConsulta").classList.remove("oculto");
        document.querySelectorAll(".aba")[1].classList.add("ativa");
        renderizarConsulta();
    }
}

async function carregarDadosSelects() {
    await carregarClientes();
    await carregarProfissionais();
    await carregarServicos();
}

async function carregarClientes() {
    const resposta = await fetch("http://localhost:3000/clientes");
    const clientes = await resposta.json();

    const select = document.getElementById("cliente_id");
    select.innerHTML = `<option value="">Selecione o cliente</option>`;

    clientes.forEach(cliente => {
        select.innerHTML += `<option value="${cliente.id}">${cliente.nome}</option>`;
    });
}

let profissionaisGlobais = [];

async function carregarProfissionais() {
    const resposta = await fetch("http://localhost:3000/profissionais");
    profissionaisGlobais = await resposta.json();

    const select = document.getElementById("profissional_id");
    const listaConsulta = document.getElementById("listaProfissionaisConsulta");

    select.innerHTML = `
        <option value="">Selecione primeiro um serviço</option>
    `;

    listaConsulta.innerHTML = "";

    profissionaisGlobais.forEach(profissional => {
        listaConsulta.innerHTML += `
            <div class="profissional-card" onclick="selecionarProfissional(${profissional.id}, this)">
                <div class="avatar-profissional">${profissional.nome.charAt(0)}</div>

                <div>
                    <strong>${profissional.nome}</strong>
                    <p>${profissional.especialidade || "Profissional"}</p>
                </div>
            </div>
        `;
    });
}

async function carregarServicos() {
    const resposta = await fetch("http://localhost:3000/servicos");
    const servicos = await resposta.json();

    const select = document.getElementById("servico_id");
    select.innerHTML = `<option value="">Selecione o serviço</option>`;

    servicos.forEach(servico => {
        select.innerHTML += `<option value="${servico.id}">${servico.nome}</option>`;
    });
}

async function carregarAgendamentos() {
    try {
        const resposta = await fetch(API_URL);
        const agendamentos = await resposta.json();

        agendamentosGlobais = agendamentos;

        atualizarTabela(agendamentos);
        renderizarConsulta();
    } catch (erro) {
        console.error("Erro ao carregar agenda:", erro);
        abrirModalAviso("Erro ao carregar agenda");
    }
}

async function cadastrarAgendamento(event) {
    event.preventDefault();

    const agendamento = {
        cliente_id: document.getElementById("cliente_id").value,
        profissional_id: document.getElementById("profissional_id").value,
        servico_id: document.getElementById("servico_id").value,
        data: document.getElementById("data").value,
        horario: document.getElementById("horario").value,
        status: document.getElementById("status").value,
        observacoes: document.getElementById("observacoes").value
    };

    try {
        const resposta = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(agendamento)
        });

        if (!resposta.ok) {
            throw new Error("Erro ao cadastrar agendamento");
        }

        document.getElementById("formAgenda").reset();
        fecharFormulario();
        carregarAgendamentos();

    } catch (erro) {
        console.error("Erro:", erro);
        abrirModalAviso("Erro ao cadastrar agendamento");
    }
}

function atualizarTabela(agendamentos) {
    const tabela = document.getElementById("listaAgendamentos");
    tabela.innerHTML = "";

    agendamentos.forEach(agendamento => {

        const classeStatus =
            agendamento.status === "Confirmado"
                ? "status-confirmado"
                : agendamento.status === "Concluído"
                ? "status-concluído"
                : agendamento.status === "Cancelado"
                ? "status-cancelado"
                : "status-agendado";

        tabela.innerHTML += `
            <tr>
                <td>${agendamento.cliente}</td>
                <td>${agendamento.profissional}</td>
                <td>${agendamento.servico}</td>
                <td>${formatarData(agendamento.data)}</td>
                <td>${formatarHorario(agendamento.horario)}</td>
                <td>
                    <button 
                        class="btn-ver"
                        onclick="abrirModalObservacao('${agendamento.observacoes || "Sem observações"}')"
                    >
                        Ver
                    </button>
                </td>

                <td>
                    <select 
                        class="select-status ${classeStatus}"
                        onchange="alterarStatusAgendamento(${agendamento.id}, this)"
                    >

                        <option value="Agendado"
                            ${agendamento.status === "Agendado" ? "selected" : ""}>
                            Agendado
                        </option>

                        <option value="Confirmado"
                            ${agendamento.status === "Confirmado" ? "selected" : ""}>
                            Confirmado
                        </option>

                        <option value="Concluído"
                            ${agendamento.status === "Concluído" ? "selected" : ""}>
                            Concluído
                        </option>

                        <option value="Cancelado"
                            ${agendamento.status === "Cancelado" ? "selected" : ""}>
                            Cancelado
                        </option>

                    </select>
                </td>

                <td>
                    <button class="btn-excluir"
                        onclick="removerAgendamento(${agendamento.id})">
                        Excluir
                    </button>
                </td>
            </tr>
        `;
    });

    document.getElementById("totalAgendamentos").innerText =
        agendamentos.length;
}

function selecionarProfissional(id, elemento) {
    profissionalSelecionado = id;

    document.querySelectorAll(".profissional-card").forEach(card => {
        card.classList.remove("ativo-profissional");
    });

    elemento.classList.add("ativo-profissional");
    filtrarConsulta();
}

function renderizarConsulta(lista = agendamentosGlobais) {
    const container = document.getElementById("cardsAgenda");

    if (!container) return;

    container.innerHTML = "";

    let agendamentos = lista;

    if (profissionalSelecionado) {
        agendamentos = agendamentos.filter(item => item.profissional_id == profissionalSelecionado);
    }

    if (agendamentos.length === 0) {
        container.innerHTML = `<p class="mensagem-vazia">Nenhum agendamento encontrado.</p>`;
        return;
    }

    agendamentos.forEach(item => {
        container.innerHTML += `
            <div class="card-agendamento ${classeStatus(item.status)}">
                <div class="hora-card">${formatarHorario(item.horario)}</div>

                <div class="info-card">
                    <strong>${item.cliente}</strong>
                    <span>${item.servico}</span>
                    <small>${formatarData(item.data)} • ${item.profissional}</small>
                </div>

                <div class="status-card">${item.status}</div>
            </div>
        `;
    });
}

function filtrarConsulta() {
    const cliente = document.getElementById("filtroCliente").value.toLowerCase();
    const servico = document.getElementById("filtroServico").value.toLowerCase();
    const data = document.getElementById("filtroData").value;

    let filtrados = agendamentosGlobais.filter(item => {
        const mesmaProfissional = profissionalSelecionado ? item.profissional_id == profissionalSelecionado : true;
        const clienteOk = item.cliente.toLowerCase().includes(cliente);
        const servicoOk = item.servico.toLowerCase().includes(servico);
        const dataOk = data ? item.data.split("T")[0] === data : true;

        return mesmaProfissional && clienteOk && servicoOk && dataOk;
    });

    renderizarConsulta(filtrados);
}

function removerAgendamento(id) {
    abrirModalConfirmacao(
        "Deseja realmente excluir este agendamento?",
        async () => {
            try {
                const resposta = await fetch(`${API_URL}/${id}`, {
                    method: "DELETE"
                });

                if (!resposta.ok) {
                    throw new Error("Erro ao excluir agendamento");
                }

                await carregarAgendamentos();
                fecharModal();

            } catch (erro) {
                console.error("Erro:", erro);
                abrirModalAviso("Erro ao excluir agendamento");
            }
        }
    );
}

function buscarAgendamento() {
    const termo = document.getElementById("busca").value.toLowerCase();
    const linhas = document.querySelectorAll("#listaAgendamentos tr");

    linhas.forEach(linha => {
        const cliente = linha.children[0].innerText.toLowerCase();
        const profissional = linha.children[1].innerText.toLowerCase();
        const servico = linha.children[2].innerText.toLowerCase();
        const status = linha.children[5].innerText.toLowerCase();

        linha.style.display =
            cliente.includes(termo) ||
            profissional.includes(termo) ||
            servico.includes(termo) ||
            status.includes(termo)
                ? ""
                : "none";
    });
}

function formatarData(dataISO) {
    if (!dataISO) return "";
    return dataISO.split("T")[0].split("-").reverse().join("/");
}

function formatarHorario(horario) {
    if (!horario) return "";
    return horario.slice(0, 5);
}

function classeStatus(status) {
    if (status === "Confirmado") return "confirmado";
    if (status === "Concluído") return "concluido";
    if (status === "Cancelado") return "cancelado";
    return "agendado";
}

document.addEventListener("DOMContentLoaded", async () => {
    await carregarDadosSelects();
    await carregarAgendamentos();
});

function filtrarProfissionaisPorServico() {
    const servicoSelecionado = document.getElementById("servico_id").value;
    const selectProfissional = document.getElementById("profissional_id");

    selectProfissional.innerHTML = `
        <option value="">Selecione o profissional</option>
    `;

    if (!servicoSelecionado) {
        selectProfissional.innerHTML = `
            <option value="">Selecione primeiro um serviço</option>
        `;
        return;
    }

    const profissionaisFiltradas = profissionaisGlobais.filter(profissional => {
        return profissional.servico_id == servicoSelecionado;
    });

    if (profissionaisFiltradas.length === 0) {
        selectProfissional.innerHTML = `
            <option value="">Nenhuma profissional para este serviço</option>
        `;
        return;
    }

    profissionaisFiltradas.forEach(profissional => {
        selectProfissional.innerHTML += `
            <option value="${profissional.id}">
                ${profissional.nome}
            </option>
        `;
    });
}

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

async function alterarStatusAgendamento(id, select) {

    const novoStatus = select.value;

    try {

        const agendamento = agendamentosGlobais.find(
            item => item.id === id
        );

        if (!agendamento) {
            abrirModalAviso("Agendamento não encontrado.");
            return;
        }

        const dadosAtualizados = {
            cliente_id: agendamento.cliente_id,
            profissional_id: agendamento.profissional_id,
            servico_id: agendamento.servico_id,
            data: agendamento.data.split("T")[0],
            horario: agendamento.horario,
            status: novoStatus,
            observacoes: agendamento.observacoes || ""
        };

        const resposta = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dadosAtualizados)
        });

        if (!resposta.ok) {
            throw new Error("Erro ao alterar status");
        }

        select.classList.remove(
            "status-agendado",
            "status-confirmado",
            "status-concluído",
            "status-cancelado"
        );

        select.classList.add(
            `status-${novoStatus.toLowerCase()}`
        );

    } catch (erro) {
        console.error("Erro:", erro);
        abrirModalAviso("Erro ao alterar status.");
    }
}

function abrirModalObservacao(texto) {

    const titulo = document.querySelector(".modal-caixa h3");
    const mensagemModal = document.getElementById("modalMensagem");
    const modal = document.getElementById("modalConfirmacao");

    const botaoConfirmar =
        document.getElementById("btnConfirmarModal");

    const botaoCancelar =
        document.querySelector(".btn-cancelar-modal");

    titulo.innerText = "Observações do agendamento";

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