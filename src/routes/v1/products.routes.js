const { Router } = require("express");
const { tokenValidate, adminValidate } = require("../../services/auth");
const {  createProduct,listProductsOffsetLimit, listProducts, listAllProducts } = require("../../controllers/products.controller");

class ProductsRouter {
  routesFromProducts() {
    const productsRoutes = Router();
    productsRoutes.get("/products/admin");
    productsRoutes.get(
      "/products/admin/:offset/:limit",
      tokenValidate,
      adminValidate,
      listProducts
    );
    productsRoutes.get( "/products/admin/:offset/:limit",tokenValidate,adminValidate,listProductsOffsetLimit);
    productsRoutes.get("/products/:productId");
    productsRoutes.post(
      "/products/admin",
      tokenValidate,
      adminValidate,
      createProduct
    );
    productsRoutes.patch("/products/admin/:productId");
    productsRoutes.get("/products/:offset/:limit", tokenValidate, listAllProducts)
    return productsRoutes;
  }
}

module.exports = new ProductsRouter();
