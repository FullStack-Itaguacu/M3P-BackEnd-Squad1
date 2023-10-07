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
