// const {  } = require("../controllers/product.controller"); 
const { Router } = require("express");
const { auth } = require("../../services/auth");

class ProductsRouter {
  routesFromProducts() {
    const productsRoutes = Router();
    productsRoutes.get("/products/admin");
    productsRoutes.get("/products/:offset/:limit");
    productsRoutes.get("/products/:productId");
    productsRoutes.post("/products/admin");
    productsRoutes.patch("/products/admin/:productId");        
    return productsRoutes;
  }
}

module.exports = new ProductsRouter();