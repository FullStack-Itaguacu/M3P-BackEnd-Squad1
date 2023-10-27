const {
  OffsetIsNan,
  LimitIsNan,
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
const { Op } = require("sequelize");
module.exports = {
  async filtroBodyOffsetLimitSearch(offset, limit) {
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

  },
  async searchOffsetLimit(
    start,
    items_for_page,
    actual_page,
    name,
    type_product,
    user_id,
    res,
    Products
  ) {
    if (
      type_product !== "controlled" &&
      type_product !== "uncontrolled" &&
      type_product !== "%"
    ) {
      throw new NotAcceptValuesTypeProduct();
    }

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
        user_id,
        type_product:
          type_product === "%"
            ? { [Op.or]: ["controlled", "uncontrolled"] }
            : type_product,
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
        status: 422,
        error: "Erro, Não foi possível criar o produto",
        cause: "O corpo da requisição não pode ser vazio.",
      };
    }

    const requiredFields = ["name", "lab_name", "image_link", "dosage", "type_product"];
    for (const field of requiredFields) {
      // Verifica se o campo obrigatório está faltando
      if (!fields[field]) {
        return {
          status: 422,
          error: "Erro, Não foi possível criar o produto",
          cause: `O campo ${field} é obrigatório.`,
        };
      }
    }

    // Adicione mais validações conforme necessário
    // Verifica se o campo 'dosage' tem valor igual à "mg", "mcg", "g", "ml", "%"
    const regexDosage = /^(mg|mcg|g|ml|%)$/;
    if (!regexDosage.test(fields.dosage)) {
      return {
        status: 400,
        error: "Erro, Não foi possível criar o produto",
        cause: "O campo dosage deve ter um dos seguintes valores: 'mg', 'mcg', 'g', 'ml', '%'.",
      };
    }

    // Verifica se type_product tem valor inválido
    if (!["controlled", "uncontrolled"].includes(fields.type_product)) {
      return {
        status: 400,
        error: "Erro, Não foi possível criar o produto",
        cause:
          "Somente são aceitos os valores: 'controlled' e 'uncontrolled' no campo type_product.",
      };
    }

    // Verifica se unit_price é undefined
    if (!fields.unit_price && fields.unit_price !== 0) {
      return {
        status: 422,
        error: "Erro, Não foi possível criar o produto",
        cause: "O campo unit_price é obrigatório.",
      };
    }

    // Verifica se unit_price é um número
    if (isNaN(fields.unit_price)) {
      return {
        status: 400,
        error: "Erro, Não foi possível criar o produto",
        cause: "O campo unit_price deve ser um número.",
      };
    }

    // Verifica se unit_price é um número e menor ou igual a zero
    if (fields.unit_price === 0 || fields.unit_price == "0" || fields.unit_price <= 0) {
      return {
        status: 400,
        error: "Erro, Não foi possível criar o produto",
        cause: "O campo unit_price deve ser um número maior que zero.",
      };
    }

    // Verifica se total_stock é undefined
    if (fields.total_stock === "" || fields.total_stock === undefined) {
      return {
        status: 422,
        error: "Erro, Não foi possível criar o produto",
        cause: "O campo total_stock é obrigatório.",
      };
    }

    // Verifica se total_stock é um número
    if (isNaN(fields.total_stock)) {
      return {
        status: 400,
        error: "Erro, Não foi possível criar o produto",
        cause: "O campo total_stock deve ser um número.",
      };
    }

    // Verifica se total_stock é menor que zero
    if (fields.total_stock < 0) {
      return {
        status: 400,
        error: "Erro, Não foi possível criar o produto",
        cause: "O campo total_stock deve ser um número igual ou maior que zero.",
      };
    }
  },
};
