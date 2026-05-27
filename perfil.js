function toggleMenu() {
    document.getElementById("sidebar").classList.toggle("recolhido");
}

document.addEventListener("DOMContentLoaded", () => {
    const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));

    if (!usuario) {
        window.location.href = "login.html";
        return;
    }

    document.getElementById("avatarPerfil").innerText = usuario.nome.charAt(0).toUpperCase();
    document.getElementById("nomePerfil").innerText = usuario.nome;
    document.getElementById("emailPerfil").innerText = usuario.email;

    document.getElementById("idPerfil").innerText = usuario.id;
    document.getElementById("nomePerfilInfo").innerText = usuario.nome;
    document.getElementById("emailPerfilInfo").innerText = usuario.email;
});

function sairSistema() {
    localStorage.removeItem("usuarioLogado");
    window.location.href = "login.html";
}

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