const {
  OffsetIsNan,
  LimitIsNan,
  NotNameReceivedError,
  NotTypeProductReceivedError,
  NotAcceptValuesTypeProduct,
  NumberNotPositive,
  TotalStockRequired,
  NotDataToUpdate,
  NotOwnerProduct,
  ProductNotFound,
  EmptyNameReceivedError,
  EmptyImageLinkReceivedError,
  EmptyDosageReceivedError,
  NegativeTotalStockValueReceivedError,
  TotalStockIsNanError,
} = require("../services/customs.errors.services");
module.exports = {
  async filtroBodyOffsetLimitSearch(offset, limit, name, type_product) {
    if (isNaN(offset)) {
      throw new OffsetIsNan();
    }
    if (isNaN(limit)) {
      throw new LimitIsNan();
    }
    if (offset < 0) {
      throw new NumberNotPositive("offset");
    }
    if (limit < 0) {
      throw new NumberNotPositive("limit");
    }
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
    if (!name) {
      throw new NotNameReceivedError();
    }
    if (!type_product || (type_product && type_product.length === 0)) {
      throw new NotTypeProductReceivedError();
    }
    if (type_product !== "controlled" && type_product !== "uncontrolled") {
      throw new NotAcceptValuesTypeProduct();
    }
  },
  async searchOffsetLimit(
    start,
    items_for_page,
    actual_page,
    name_variation,
    type_product,
    user_id,
    res,
    Products
  ) {
    Products.findAndCountAll({
      where: {
        name: name_variation,
        type_product: type_product,
        user_id: user_id,
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
        return error;
      });
  },
  async filtroUpdateProductById(
    name,
    image_link,
    dosage,
    total_stock,
    user_id,
    product
  ) {
    if (!product) {
      throw new ProductNotFound();
    }
    if (product.user_id != user_id) {
      throw new NotOwnerProduct();
    }
    if (!name && !image_link && !dosage && !total_stock) {
      throw new NotDataToUpdate();
    }
    if (!total_stock) {
      throw new TotalStockRequired();
    }
    if (name && name.length == 0) {
      throw new EmptyNameReceivedError();
    }
    if (image_link && image_link.length == 0) {
      throw new EmptyImageLinkReceivedError();
    }
    if (dosage && dosage.length == 0) {
      throw new EmptyDosageReceivedError();
    }
    if (total_stock < 0) {
      throw new NegativeTotalStockValueReceivedError();
    }
    if (isNaN(total_stock)) {
      throw new TotalStockIsNanError();
    }

    //se cumprir todas as validações, será atualizado o produto
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
  },
  async updateProductById(product, res) {
    await product.save();
    return res.sendStatus(204);
  },
  async validateFields(fields) {
    // Verifica se o objeto é nulo ou indefinido
    if (!fields || Object.keys(fields).length === 0) {
      return {
        status: "422",
        error: "Erro, Não foi possível criar o produto",
        cause: "O corpo da requisição não pode ser vazio.",
      };
    }

    const requiredFields = ['name', 'lab_name', 'image_link', 'dosage'];
    for (const field of requiredFields) {
      // Verifica se o campo obrigatório está faltando
      if (!fields[field]) {
        return {
          status: "422",
          error: "Erro, Não foi possível criar o produto",
          cause: `O campo ${field} é obrigatório.`,
        };
      }
    }

    // Verifica se unit_price é menor ou igual a zero
    if (typeof fields.unit_price !== 'number' || fields.unit_price <= 0) {
      return {
        status: "422",
        error: "Erro, Não foi possível criar o produto",
        cause: "O campo unit_price deve ser maior que zero.",
      };
    }

    // Verifica se total_stock é menor que zero
    if (typeof fields.total_stock !== 'number' || fields.total_stock < 0) {
      return {
        status: "422",
        error: "Erro, Não foi possível criar o produto",
        cause: "O campo total_stock não pode ser menor que zero.",
      };
    }

    // Adicione mais validações conforme necessário
    // Verifica se type_product tem valor inválido
    if (!['controlled', 'uncontrolled'].includes(fields.type_product)) {
      return {
        status: "400",
        error: "Erro, Não foi possível criar o produto",
        cause: "Somente são aceitos os valores: 'controlled' e 'uncontrolled' no campo type_product.",
      };
    }

  }
};
