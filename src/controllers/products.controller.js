const Products = require("../models/product");
// const { errorLauncher } = require("../services/user.services");
const {errorLauncher} = require("../services/customs.errors.services.js");
const {
  filtroBodyOffsetLimitSearch,
  searchOffsetLimit,
  filtroUpdateProductById,
  updateProductById,
} = require("../services/product.services");
const {InvalidKeysReceivedError}= require("../services/customs.errors.services");
module.exports = {
  async listProductsOffsetLimit(req, res) {
    try {
      const user_id = req.payload.id;
      const { name, type_product } = req.query;
      var { offset, limit } = req.params;

      await filtroBodyOffsetLimitSearch(offset, limit, name, type_product);

      const items_for_page = parseInt(limit);
      const actual_page = parseInt(offset);
      //calculo para saber o inicio da paginação no banco de dados
      var start = parseInt((actual_page - 1) * items_for_page);
      //se o start for menor que 0, será setado em 0 para não quebrar a paginação
      start < 0 ? (start = 0) : (start = start);

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
  async updateProductById(req, res) {
    try {
      const { name, image_link, dosage, total_stock } = req.body;
      const { product_id } = req.params;
      const user_id = req.payload.id;
      const product = await Products.findByPk(product_id);
      const body_keys = Object.keys(req.body);
      //verificar que so vem no body name, image_link , dosage e total_stock
      const allowedUpdates = ["name", "image_link", "dosage", "total_stock"];
      const isValidOperation = body_keys.every((update) =>
        allowedUpdates.includes(update)
      );
      if (!isValidOperation) {
        throw new InvalidKeysReceivedError();
      }
   
      await filtroUpdateProductById(
        name,
        image_link,
        dosage,
        total_stock,
        user_id,
        product,
        res,
        body_keys
      );

      await updateProductById(product, res);
    } catch (error) {
       errorLauncher(error, res);
    }
  },
};
