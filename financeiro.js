const API_FINANCEIRO = "http://localhost:3000/financeiro";

function toggleMenu() {
    document.getElementById("sidebar").classList.toggle("recolhido");
}

function abrirFormulario() {
    document.getElementById("painelDireito").classList.add("aberto");
}

function fecharFormulario() {
    document.getElementById("painelDireito").classList.remove("aberto");
}

function mostrarAbaFinanceiro(aba) {
    document.getElementById("abaReceber").classList.add("oculto");
    document.getElementById("abaRecebidos").classList.add("oculto");
    document.getElementById("abaRelatorios").classList.add("oculto");

    document.querySelectorAll(".aba").forEach(btn => btn.classList.remove("ativa"));

    if (aba === "receber") {
        document.getElementById("abaReceber").classList.remove("oculto");
        document.querySelectorAll(".aba")[0].classList.add("ativa");
    }

    if (aba === "recebidos") {
        document.getElementById("abaRecebidos").classList.remove("oculto");
        document.querySelectorAll(".aba")[1].classList.add("ativa");
    }

    if (aba === "relatorios") {
        document.getElementById("abaRelatorios").classList.remove("oculto");
        document.querySelectorAll(".aba")[2].classList.add("ativa");
    }
}

async function carregarFinanceiro() {
    await carregarContasReceber();
    await carregarRecebidos();
    await carregarRelatorio();
}

async function carregarContasReceber() {
    const resposta = await fetch(`${API_FINANCEIRO}/contas-receber`);
    const dados = await resposta.json();

    const tabela = document.getElementById("listaReceber");
    tabela.innerHTML = "";

    dados.forEach(item => {
        tabela.innerHTML += `
            <tr>
                <td>${item.cliente}</td>
                <td>${item.profissional}</td>
                <td>${item.servico}</td>
                <td>R$ ${formatarPreco(item.valor)}</td>
                <td>${formatarData(item.data)}</td>
                <td>${item.status_agenda}</td>
                <td>${item.status_financeiro}</td>
                <td>
                    <button class="btn-baixa" onclick="abrirBaixa(${item.id})">
                        Dar baixa
                    </button>
                </td>
            </tr>
        `;
    });
}

async function carregarRecebidos() {
    const resposta = await fetch(`${API_FINANCEIRO}/recebidos`);
    const dados = await resposta.json();

    const tabela = document.getElementById("listaRecebidos");
    tabela.innerHTML = "";

    dados.forEach(item => {
        tabela.innerHTML += `
            <tr>
                <td>${item.cliente}</td>
                <td>${item.profissional}</td>
                <td>${item.servico}</td>
                <td>R$ ${formatarPreco(item.valor)}</td>
                <td>R$ ${formatarPreco(item.valor_comissao)}</td>
                <td>R$ ${formatarPreco(item.valor_empresa)}</td>
                <td>${item.forma_pagamento}</td>
                <td>${formatarData(item.data_pagamento)}</td>
            </tr>
        `;
    });
}

async function carregarRelatorio() {
    const resposta = await fetch(`${API_FINANCEIRO}/relatorio`);
    const dados = await resposta.json();

    document.getElementById("totalRecebido").innerText = `R$ ${formatarPreco(dados.total_recebido || 0)}`;
    document.getElementById("totalReceber").innerText = `R$ ${formatarPreco(dados.total_a_receber || 0)}`;
    document.getElementById("atendimentosPagos").innerText = dados.atendimentos_pagos || 0;
    document.getElementById("atendimentosPendentes").innerText = dados.atendimentos_pendentes || 0;
}

function abrirBaixa(id) {
    document.getElementById("financeiro_id").value = id;
    abrirFormulario();
}

async function salvarBaixa(event) {
    event.preventDefault();

    const id = document.getElementById("financeiro_id").value;

    const dados = {
        forma_pagamento: document.getElementById("forma_pagamento").value,
        status_financeiro: document.getElementById("status_financeiro").value,
        data_pagamento: document.getElementById("data_pagamento").value,
        observacoes: document.getElementById("observacoes").value
    };

    const resposta = await fetch(`${API_FINANCEIRO}/baixa/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dados)
    });

    if (!resposta.ok) {
        alert("Erro ao dar baixa");
        return;
    }

    document.getElementById("formBaixa").reset();
    fecharFormulario();
    carregarFinanceiro();
}

function formatarPreco(valor) {
    return Number(valor).toFixed(2).replace(".", ",");
}

function formatarData(dataISO) {
    if (!dataISO) return "";
    return dataISO.split("T")[0].split("-").reverse().join("/");
}

document.addEventListener("DOMContentLoaded", carregarFinanceiro);