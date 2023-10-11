const { Router } = require("express");
const { tokenValidate, adminValidate } = require("../../services/auth");
const { storeSale, listSales, listSalesAdmin, getSalesDashboardAdmin } = require("../../controllers/sales.controller")

class SalesRouter {
  routesFromSales() {
    const salesRoutes = Router();
    salesRoutes.get("/sales/", tokenValidate, listSales);
    salesRoutes.get("/sales/admin", tokenValidate, adminValidate, listSalesAdmin);
    salesRoutes.get("/sales/dashboard/admin", tokenValidate, adminValidate, getSalesDashboardAdmin);
    salesRoutes.post("/sales/", tokenValidate, storeSale);

    return salesRoutes;
  }
}

module.exports = new SalesRouter()

