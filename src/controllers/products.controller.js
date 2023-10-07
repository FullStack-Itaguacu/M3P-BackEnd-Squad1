const Products = require("../models/product");
const User = require("../models/user");

module.exports = {
  async listProducts(req, res) {
    try {
      const user_id = req.payload.id;
      const { name, type_product } = req.query;
      var { offset, limit } = req.params;
      /* limitando a quantidade de itens por página a 20,
       * caso o usuário tente passar um valor maior que 20
       * valor será setado em 20 para nao quebrar a paginação .
       */
      limit > 20 ? (limit = 20) : (limit = limit);
      /**
       * se offset for menor que 1, será setado em 1
       * para não quebrar a paginação.
       */
      offset < 1 ? (offset = 1) : (offset = offset);

      const items_for_page = parseInt(limit);
      const actual_page = parseInt(offset);
      const start = parseInt((actual_page - 1) * items_for_page);
      //para garantir a busca, o nome do produto será buscado em 3 variações (lowercase, uppercase e capitalize)
      const name_variation = [
        name.toLowerCase(),
        name.toUpperCase(),
        (nameCapitalize = name[0].toUpperCase() + name.slice(1)),
      ];
      Products.findAndCountAll({
        where: {
          name: name_variation,
          type_product: type_product,
          user_id: user_id,
        },
        offset: start,
        limit: items_for_page,
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
      return res.send(error);
    }
  },
  async createProduct(req, res) {
    try {
      const {
        name,
        lab_name,
        image_link,
        dosage,
        unit_price,
        type_product,
        total_stock,
      } = req.body;
     
      if (!req.payload || !req.payload.id) {
        return res
          .status(400)
          .json({ error: "ID do usuário não fornecido no token" });
      }

      const { id: user_id } = req.payload;
      const user = await User.findByPk(user_id);

      if (!user) {
        return res.status(400).json({ error: "Usuário não encontrado" });
      }
      console.log("Antes de criar produto", req.body);
      const newProduct = await Products.create({
        user_id, // Corrigido para usar user_id
        name,
        lab_name,
        image_link,
        dosage,
        unit_price,
        type_product,
        total_stock,
      });
      console.log("depois de criar" , newProduct);
      return res
        .status(201)
        .json({ message: "Produto criado com sucesso", produto: newProduct });
    } catch (error) {
      return res.status(400).json({
        error: "Erro ao criar produto",
        message: error.message,
        cause: "Foi erro do desenvolvedor :(",
        
        
      });
    }
  },
};
