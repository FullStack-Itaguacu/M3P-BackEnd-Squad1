// const { loginUser, createOneUser } = require("../controllers/user.controller"); 
const { Router } = require("express");
const { tokenValidate, adminValidate } = require("../../services/auth");
const { getSalesDashboardAdmin } = require("../../controllers/sales.controller");

class SalesRouter {
  routesFromSales() {
    const salesRoutes = Router();
    salesRoutes.get("/sales/");
    salesRoutes.get("/sales/admin");
    salesRoutes.get("/sales/dashboard/admin" , tokenValidate, adminValidate, getSalesDashboardAdmin);
    salesRoutes.post("/sales/");          

    return salesRoutes;
  }
}

module.exports = new SalesRouter();
