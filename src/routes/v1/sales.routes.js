// const { loginUser, createOneUser } = require("../controllers/user.controller"); 
const { Router } = require("express");
const { auth } = require("../../services/auth");

class SalesRouter {
  routesFromSales() {
    const salesRoutes = Router();
    salesRoutes.get("/sales/");
    salesRoutes.get("/sales/admin");
    salesRoutes.get("/sales/dashboard/admin");
    salesRoutes.post("/sales/");          

    return salesRoutes;
  }
}

module.exports = new SalesRouter();
