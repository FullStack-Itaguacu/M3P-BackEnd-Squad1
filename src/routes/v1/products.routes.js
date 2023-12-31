const { Router } = require("express");
const { tokenValidate, adminValidate } = require("../../services/auth");
const { createProduct, listProductsOffsetLimit, updateProductById, listAllProducts, listProductById } = require("../../controllers/products.controller");

class ProductsRouter {
  routesFromProducts() {
    const productsRoutes = Router();
    productsRoutes.get("/products/admin/:offset/:limit", tokenValidate, adminValidate, listProductsOffsetLimit);
    productsRoutes.get("/products/:product_id", tokenValidate, listProductById);
    productsRoutes.post("/products/admin", tokenValidate, adminValidate, createProduct);
    productsRoutes.patch("/products/admin/:product_id", tokenValidate, adminValidate, updateProductById);
    productsRoutes.get("/products/:offset/:limit", tokenValidate, listAllProducts)
    return productsRoutes;
  }
}

module.exports = new ProductsRouter();