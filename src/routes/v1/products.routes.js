// const {  } = require("../controllers/product.controller");
const { Router } = require("express");
const { tokenValidate, adminValidate } = require("../../services/auth");
const { listProductsOffsetLimit } = require("../../controllers/products.controller");

class ProductsRouter {
  routesFromProducts() {
    const productsRoutes = Router();
    productsRoutes.get("/products/admin");
    productsRoutes.get( "/products/admin/:offset/:limit",tokenValidate,adminValidate,listProductsOffsetLimit);
    productsRoutes.get("/products/:productId");
    productsRoutes.post("/products/admin");
    productsRoutes.patch("/products/admin/:productId");
    return productsRoutes;
  }
}

module.exports = new ProductsRouter();
