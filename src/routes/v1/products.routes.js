// const {  } = require("../controllers/product.controller");
const { Router } = require("express");
const { tokenValidate, adminValidate } = require("../../services/auth");
const { listProductsOffsetLimit, updateProductById } = require("../../controllers/products.controller");


class ProductsRouter {
  routesFromProducts() {
    const productsRoutes = Router();
    productsRoutes.get("/products/admin");
    productsRoutes.get( "/products/admin/:offset/:limit",tokenValidate,adminValidate,listProductsOffsetLimit);
    productsRoutes.get("/products/:productId");
    productsRoutes.post("/products/admin");
    productsRoutes.patch("/products/admin/:product_id", tokenValidate, adminValidate, updateProductById);
    return productsRoutes;
  }
}

module.exports = new ProductsRouter();
