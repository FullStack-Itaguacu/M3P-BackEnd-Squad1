const Products = require("../models/product");

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
  async updateProductById(req, res) {
    const { name, image_link, dosage, total_stock } = req.body;
    const { product_id } = req.params;
    const user_id = req.payload.id;
    const product = await Products.findByPk(product_id);
    if (!product) {
      return res.status(404).json({
        status: "404",
        message: "Produto não encontrado",
        cause : "Produto não encontrado no banco de dados com o id informado",
        error : "ProductNotFound"
      });
    }
    if (product.user_id != user_id) {
      return res.status(401).json({
        status: "401",
        message: "Você não tem permissão para atualizar este produto",
        cause : "Esta tentando atualizar um produto que não é seu",
        error : "NotOwnerProduct"
      });
    }
    if(!name && !image_link && !dosage && !total_stock){
      return res.status(400).json({
        status: "400",
        message: "Nenhum dado para atualizar",
        cause : "Nenhum dado para atualizar",
        error : "NoDataToUpdate"
      });
    }
    if(!total_stock){
      return res.status(400).json({
        status: "400",
        message: "O campo total_stock é obrigatório",
        cause : "Não informou o campo total_stock no body é ele obrigatório",
        error : "TotalStockRequired"
      });
    }
    if (name) {
      product.name = name;
    }
    if (image_link) {
      product.image_link = image_link;
    }
    if (dosage) {
      product.dosage = dosage;
    }
    if (total_stock) {
      product.total_stock = total_stock;
    }
    await product.save();
    return res.status(200).json({
      status: "200",
      message: "Produto atualizado com sucesso",
      product,
    });
  },
};
