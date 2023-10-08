const { Router } = require("express");
const {tokenValidate, adminValidate} = require("../../services/auth");
const{getBuyersOffsetLimit}=require("../../controllers/buyers.controller")
class BuyersRouter {
  routesFromBuyers() {
    const buyersRoutes = Router();
    buyersRoutes.get("/buyers/admin/:offset/:limit",tokenValidate,adminValidate, getBuyersOffsetLimit);
    buyersRoutes.get("/buyers/admin/:userId");
    buyersRoutes.patch("/buyers/admin/:userId");

    return buyersRoutes;
  }
}

module.exports = new BuyersRouter();
