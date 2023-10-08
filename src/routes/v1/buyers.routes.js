// const { loginUser, createOneUser } = require("../controllers/user.controller"); 
const { Router } = require("express");
const { tokenValidate, adminValidate } = require("../../services/auth");
const { listOneBuyer } = require("../../controllers/user.controller");

class BuyersRouter {
  routesFromBuyers() {
    const buyersRoutes = Router();
    buyersRoutes.get("/buyers/admin/:offset/:limit");
    buyersRoutes.get("/buyers/admin/:user_id", tokenValidate, adminValidate, listOneBuyer);
    buyersRoutes.patch("/buyers/admin/:user_id");

    return buyersRoutes;
  }
}

module.exports = new BuyersRouter();
