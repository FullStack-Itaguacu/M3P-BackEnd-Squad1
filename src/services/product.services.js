const {
  OffsetIsNan,
  LimitIsNan,
  NotNameReceivedError,
  NotTypeProductReceivedError,
  NotAcceptValuesTypeProduct,
  NumberNotPositive
} = require("../services/customs.errors.services")
module.exports = {
  async filtroBodyOffsetLimitSearch(offset, limit, name, type_product) {
    if (isNaN(offset)) {
      throw new OffsetIsNan();
    }
    if (isNaN(limit)) {
      throw new LimitIsNan();
    }
    if (offset < 0) {
      throw new NumberNotPositive("offset")
    }
    if (limit < 0) {
      throw new NumberNotPositive("limit")
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
      throw new NotNameReceivedError()
    }
    if (!type_product || (type_product && type_product.length === 0)) {
      throw new NotTypeProductReceivedError()
    }
    if (type_product !== "controlled" && type_product !== "uncontrolled") {
      throw new NotAcceptValuesTypeProduct();
    }
  },
  async searchOffsetLimit(start, items_for_page, actual_page, name_variation, type_product, user_id, res, Products) {
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
        return error
      });
  }
};
