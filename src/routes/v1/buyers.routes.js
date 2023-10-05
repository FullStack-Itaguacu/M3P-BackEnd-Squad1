// const { loginUser, createOneUser } = require("../controllers/user.controller"); 
const { Router } = require("express");
const { auth } = require("../../services/auth");

class BuyersRouter {
  routesFromBuyers() {
    const buyersRoutes = Router();
    buyersRoutes.get("/buyers/admin/:offset/:limit");
    buyersRoutes.get("/buyers/admin/:userId");
    buyersRoutes.patch("/buyers/admin/:userId");       

    return buyersRoutes;
  }
}

module.exports = new BuyersRouter();
