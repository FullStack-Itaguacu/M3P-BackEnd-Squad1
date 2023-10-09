// const { loginUser, createOneUser } = require("../controllers/user.controller"); 
const { Router } = require("express");
const { auth } = require("../../services/auth");
const {tokenValidate} =require("../../services/auth");
const{storeSale} = require("../../controllers/sales.controller")

class SalesRouter {
  routesFromSales() {
    const salesRoutes = Router();
    salesRoutes.get("/sales/");
    salesRoutes.get("/sales/admin");
    salesRoutes.get("/sales/dashboard/admin");
    salesRoutes.post("/sales/", tokenValidate, storeSale);          

    return salesRoutes;
  }
}

module.exports = new SalesRouter();
