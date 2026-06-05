const express = require("express");
const cors = require("cors");

const clienteRoutes = require("./routes/clienteRoutes");
const profissionalRoutes = require("./routes/profissionalRoutes");
const servicoRoutes = require("./routes/servicoRoutes");
const agendaRoutes = require("./routes/agendaRoutes");
const financeiroRoutes = require("./routes/financeiroRoutes");
const estoqueRoutes = require("./routes/estoqueRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const usuarioRoutes = require("./routes/usuarioRoutes");

const app = express();

/* LIBERAR CORS */
app.use(cors());

app.use(express.json());

/* ROTAS */
app.use("/clientes", clienteRoutes);
app.use("/profissionais", profissionalRoutes);
app.use("/servicos", servicoRoutes);
app.use("/agenda", agendaRoutes);
app.use("/financeiro", financeiroRoutes);
app.use("/estoque", estoqueRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/usuarios", usuarioRoutes);

/* SERVIDOR */
app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});