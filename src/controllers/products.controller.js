const Products = require("../models/product");
const User = require("../models/user");
const { validateFields } = require("../services/product.service");
const {errorLauncher} = require("../services/customs.errors.services.js");
const { verificaNumeroPositivo, verificaSomenteNumeros } = require("../services/validators")
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

  async createProduct(req, res) {
    try {

      const validationError = validateFields(req.body);
      if (validationError) {
        return res.status(validationError.status).json({ error: validationError });
      }
      const {
        name,
        lab_name,
        image_link,
        dosage,
        unit_price,
        type_product,
        total_stock,
      } = req.body;
     
      const user_id = req.payload.id;
      const existMedicine = await Products.findOne({
        where: {
          name: name,
          lab_name: lab_name,
        },
      });
  
      if (existMedicine) {
        return res.status(422).json({
          status: "422",
          error: "Erro, Não foi possível criar o produto",
          cause: "O produto já existe.",
        });
      }
      const newProduct = await Products.create({
        user_id,
        name,
        lab_name,
        image_link,
        dosage,
        unit_price,
        type_product,
        total_stock,
      });

      return res
        .status(201)
        .json({ message: "Produto criado com sucesso", produto: newProduct });
    } catch (error) {
      return res.status(500).json({
        status: "500",
        error: "Erro ao criar produto",
        cause: error.message,
      });
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
  async listAllProducts(req, res) {
    try {
      var { offset, limit } = req.params
      const { name, type_product } = req.query

      await filtroBodyOffsetLimitSearch(offset, limit, name, type_product);

      limit > 20 ? (limit = 20) : limit
      offset < 0 ? (offset - 1) : (offset = offset)

      const actual_page = parseInt(offset);
      const start = parseInt(offset)
      const items_for_page = parseInt(limit)
      const name_variation = [
        name.toLowerCase(),
        name.toUpperCase(),
        (nameCapitalize = name[0].toUpperCase() + name.slice(1)),
      ]

      Products.findAndCountAll({
        where: {
          name: name_variation,
          type_product: type_product
        },
        offset: start,
        limit: items_for_page,
        order: [
          ['total_stock', 'DESC']
        ]
      })
        .then((result) => {
          const total_items = result.count;
          const total_pages = Math.ceil(total_items / items_for_page);
          var next_page = actual_page < total_pages ? actual_page + 1 : 0;
          var prev_page = actual_page > 1 ? actual_page - 1 : 0;

          if (actual_page > 1) {
            prev_page = actual_page - 1;
          }

          if (actual_page >= total_pages) {
            next_page = 1;
          }
          const products = result.rows;
          if (products.length == 0) {
            return res.sendStatus(204);
          }
          return res.status(200).json({
            status: "200",
            total_items,
            items_for_page,
            total_pages,
            prev_page,
            next_page,
            actual_page,
            products,
          });
        })
        .catch((error) => {
          return res.status(500).json({
            status: "500",
            error: error,
            message: error.message,
            cause: "Foi erro do desenvolvedor :(",
          });
        });
    } catch (error) {
      errorLauncher(error, res)
    }
  }
};
