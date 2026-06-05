const express = require("express");
const router = express.Router();
const controller = require("../controllers/financeiroController");

router.get("/contas-receber", controller.contasReceber);
router.get("/recebidos", controller.recebidos);
router.get("/relatorio", controller.relatorio);
router.put("/baixa/:id", controller.darBaixa);

module.exports = router;