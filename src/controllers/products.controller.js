const Products = require("../models/product");
const { errorLauncher } = require("../services/user.services");
const {
  filtroBodyOffsetLimitSearch,
  searchOffsetLimit,
} = require("../services/product.services");

module.exports = {
  async listProductsOffsetLimit(req, res) {
    try {
      const user_id = req.payload.id;
      const { name, type_product } = req.query;
      var { offset, limit } = req.params;

      await filtroBodyOffsetLimitSearch(offset, limit, name, type_product);

      const items_for_page = parseInt(limit);
      const actual_page = parseInt(offset);
      const start = parseInt((actual_page - 1) * items_for_page);

      //para garantir a busca, o nome do produto será buscado em 3 variações (lowercase, uppercase e capitalize)
      const name_variation = [
        name.toLowerCase(),
        name.toUpperCase(),
        (nameCapitalize = name[0].toUpperCase() + name.slice(1)),
      ];
      await searchOffsetLimit(
        start,
        items_for_page,
        actual_page,
        name_variation,
        type_product,
        user_id,
        res,
        Products
      );
    } catch (error) {
      errorLauncher(error, res);
    }
  },
};
