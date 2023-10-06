const Products = require("../models/product");

module.exports = {
  async listProducts(req, res) {
    try {
      const { offset, limit } = req.params;
      const { name, type_product, total_stock } = req.query;

      console.log(
        "offset",
        offset,
        "limit",
        limit,
        "name",
        name,
        "type_product",
        type_product,
        "total_stock",
        total_stock
      );
    } catch (error) {
      console.error(error);
    }
  },
};
