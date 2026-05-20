const API_DASHBOARD = "http://localhost:3000/dashboard/resumo";

function toggleMenu() {
    document.getElementById("sidebar").classList.toggle("recolhido");
}

async function carregarDashboard() {
    const resposta = await fetch(API_DASHBOARD);
    const dados = await resposta.json();

    document.getElementById("totalClientes").innerText = dados.totalClientes;
    document.getElementById("agendaHoje").innerText = dados.agendaHoje;
    document.getElementById("faturamentoMes").innerText = `R$ ${formatarPreco(dados.faturamentoMes)}`;
    document.getElementById("servicosRealizados").innerText = dados.servicosRealizados;

    criarGraficoFaturamento(dados.faturamentoMensal);
    criarGraficoServicos(dados.servicosMaisRealizados);
    criarGraficoHorarios(dados.horariosMaisProcurados);
    carregarAgendaDoDia(dados.agendaDoDia);
    carregarAlertas(dados.estoqueBaixo);
}

function criarGraficoFaturamento(dados) {
    const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    const valores = Array(12).fill(0);

    dados.forEach(item => {
        valores[item.mes - 1] = Number(item.total);
    });

    new Chart(document.getElementById("graficoFaturamento"), {
        type: "line",
        data: {
            labels: meses,
            datasets: [{
                label: "Faturamento",
                data: valores,
                borderColor: "#ff4d88",
                backgroundColor: "rgba(255, 77, 136, 0.15)",
                fill: true,
                tension: 0.4
            }]
        }
    });
}

function criarGraficoServicos(dados) {
    new Chart(document.getElementById("graficoServicos"), {
        type: "doughnut",
        data: {
            labels: dados.map(item => item.servico),
            datasets: [{
                data: dados.map(item => item.total),
                backgroundColor: ["#ff4d88", "#9b5de5", "#f9c74f", "#90dbf4", "#d9d9d9"]
            }]
        }
    });
}

function criarGraficoHorarios(dados) {
    new Chart(document.getElementById("graficoHorarios"), {
        type: "bar",
        data: {
            labels: dados.map(item => `${item.hora}:00`),
            datasets: [{
                label: "Agendamentos",
                data: dados.map(item => item.total),
                backgroundColor: "#ff4d88",
                borderRadius: 8
            }]
        }
    });
}

function carregarAgendaDoDia(lista) {
    const div = document.getElementById("agendaDoDia");
    div.innerHTML = "";

    if (lista.length === 0) {
        div.innerHTML = `<p class="mensagem-vazia">Nenhum agendamento hoje.</p>`;
        return;
    }

    lista.forEach(item => {
        div.innerHTML += `
            <div class="item-dashboard">
                <strong>${formatarHorario(item.horario)} - ${item.cliente}</strong>
                <span>${item.servico} com ${item.profissional}</span>
                <small>${item.status}</small>
            </div>
        `;
    });
}

function carregarAlertas(estoque) {
    const div = document.getElementById("alertas");
    div.innerHTML = "";

    if (estoque.length === 0) {
        div.innerHTML = `<p class="mensagem-vazia">Nenhum alerta no momento.</p>`;
        return;
    }

    estoque.forEach(item => {
        div.innerHTML += `
            <div class="item-dashboard alerta">
                ⚠️ Estoque baixo: ${item.nome}
                <small>${item.quantidade} unidades restantes</small>
            </div>
        `;
    });
}

function formatarPreco(valor) {
    return Number(valor || 0).toFixed(2).replace(".", ",");
}

function formatarHorario(horario) {
    if (!horario) return "";
    return horario.slice(0, 5);
}

document.addEventListener("DOMContentLoaded", carregarDashboard);