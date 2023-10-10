// const { loginUser, createOneUser } = require("../controllers/user.controller"); 
const { Router } = require("express");
const { tokenValidate, adminValidate } = require("../../services/auth");
const { getSalesDashboardAdmin } = require("../../controllers/sales.controller");

class SalesRouter {
  routesFromSales() {
    const salesRoutes = Router();

    // Endpoint para obter o dashboard de vendas do admin
    salesRoutes.get("/sales/dashboard/admin", tokenValidate, adminValidate, getSalesDashboardAdmin);

    // Outros endpoints que você pode ter
    salesRoutes.get("/sales/", /* sua função de manipulação de rota para /sales/ */);
    salesRoutes.get("/sales/admin", /* sua função de manipulação de rota para /sales/admin */);
    salesRoutes.post("/sales/", /* sua função de manipulação de rota para POST /sales/ */);

    return salesRoutes;
  }
}

module.exports = new SalesRouter()

