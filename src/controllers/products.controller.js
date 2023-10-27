const Products = require("../models/product");
const { errorLauncher } = require("../services/customs.errors.services.js");
const { verificaSomenteNumeros } = require("../services/validators");
const {
  filtroBodyOffsetLimitSearch,
  searchOffsetLimit,
  filtroUpdateProductById,
  updateProductById,
  validateFields,
} = require("../services/product.services");
const {
  InvalidKeysReceivedError,
  CustomizableError,
} = require("../services/customs.errors.services");
const { Op } = require("sequelize");

module.exports = {
  async listProductsOffsetLimit(req, res) {
    try {
      const user_id = req.payload.id;
      var { name, type_product } = req.query;
      var { offset, limit } = req.params;

      await filtroBodyOffsetLimitSearch(offset, limit, name, type_product);
      /* limitando a quantidade de itens por página a 20,
       * caso o usuário tente passar um valor maior que 20
       * valor será setado em 20 para nao quebrar a paginação .
       */
      limit > 20 ? (limit = 30) : (limit = limit);
      /**
       * se offset for menor que 1, será setado em 1
       * para não quebrar a paginação.
       */
      offset < 1 ? (offset = 1) : (offset = offset);

      const items_for_page = parseInt(limit);
      const actual_page = parseInt(offset);
      //calculo para saber o inicio da paginação no banco de dados
      var start = parseInt((actual_page - 1) * items_for_page);
      //se o start for menor que 0, será setado em 0 para não quebrar a paginação
      start < 0 ? (start = 0) : (start = start);
      if (name && type_product) {
        await searchOffsetLimit(
          start,
          items_for_page,
          actual_page,
          name,
          type_product,
          user_id,
          res,
          Products
        );
      }

      if (!name && !type_product) {
        await searchOffsetLimit(
          start,
          items_for_page,
          actual_page,
          (name = "%"),
          (type_product = "%"),
          user_id,
          res,
          Products
        );
      }
      if (name && !type_product) {
        await searchOffsetLimit(
          start,
          items_for_page,
          actual_page,
          name,
          (type_product = "%"),
          user_id,
          res,
          Products
        );
      }
      if (type_product && !name) {
        await searchOffsetLimit(
          start,
          items_for_page,
          actual_page,
          (name = "%"),
          type_product,
          user_id,
          res,
          Products
        );
      }
    } catch (error) {
      errorLauncher(error, res);
    }
  },

  async createProduct(req, res) {
    try {
      const validationError = await validateFields(req.body);
      if (validationError) {
        return res
          .status(validationError.status)
          .json({ error: validationError });
      }

      const {
        name,
        lab_name,
        image_link,
        dosage,
        unit_price,
        type_product,
        total_stock,
        description,
      } = req.body;

      const user_id = req.payload.id;
      const existMedicine = await Products.findOne({
        where: {
          user_id,
          name
        },
      });

      if (existMedicine) {
        return res.status(422).json({
          status: 422,
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
        description,
      });

      return res
        .status(201)
        .json({ message: "Produto criado com sucesso", produto: newProduct });
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
  async listAllProducts(req, res) {
    try {
      var { offset, limit } = req.params;
      var { name, type_product } = req.query;

      const types_alowed = ["controlled", "uncontrolled"]

      if (type_product) {
        if (!types_alowed.includes(type_product)) {
          throw new CustomizableError(
            "InvalidTypeProductError",
            `Tipo de produto ${type_product} não é permitido esperamos um dos seguintes valores: ${types_alowed}`,
            "Dados inválidos na requisição",
            422
          );
        }
      }
      if (!name) name = "%";

      await filtroBodyOffsetLimitSearch(offset, limit);

      limit > 20 ? (limit = 20) : limit;
      offset < 0 ? offset - 1 : (offset = offset);

      const actual_page = parseInt(offset);
      const start = parseInt(offset);
      const items_for_page = parseInt(limit);


      Products.findAndCountAll({
        where: {
          name: {
            [Op.or]: [
              {
                [Op.like]: `${name}`,
              },
              {
                [Op.like]: `${name.toUpperCase()}`,
              },
              {
                [Op.like]: `%${name}%`,
              },
              {
                [Op.like]: `%${name[0].toUpperCase() + name.slice(1)}%`,
              },
            ],
          },
          type_product: type_product
            ? type_product
            : { [Op.or]: ["controlled", "uncontrolled"] },
        },
        offset: start,
        limit: items_for_page,
        order: [["total_stock", "DESC"]],
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
      errorLauncher(error, res);
    }
  },

  async listProductById(req, res) {
    try {
      const { product_id } = req.params;

      await verificaSomenteNumeros(product_id, "productId");

      const product = await Products.findByPk(product_id);

      if (!product) {
        return res.status(404).json({
          message: "Produto não encontrado.",
          status: 404,
          cause: "Produto não encontrado na base de dados.",
          error: "ProductNotFoundError",
        });
      }

      return res.status(200).json(product);
    } catch (error) {
      errorLauncher(error, res);
    }
  },
};
