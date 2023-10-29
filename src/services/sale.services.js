const { Sales } = require("../models/sales");
const Product = require("../models/product");
const Address = require("../models/address");
require("../models/userAddress");

const { CustomizableError } = require("../services/customs.errors.services");
const User = require("../models/user");
module.exports = {
  async isAllMandatoryFields(sale) {
    const { product_id, amount_buy, users_addresses_id, type_payment } = sale;
    const notInformedFields = [];
    if (!product_id) {
      notInformedFields.push("product_id");
    }
    if (!amount_buy) {
      notInformedFields.push("amount_buy");
    }
    if (!users_addresses_id) {
      notInformedFields.push("users_addresses_id");
    }
    if (!type_payment) {
      notInformedFields.push("type_payment");
    }

    if (notInformedFields.length > 0) {
      throw new CustomizableError(
        "NotInformedFields",
        `Falto informar ${notInformedFields.join(", ")} na requisição.`,
        "Campos não informados",
        422
      );
    }
  },
  async findAdminSales(id) {
    const data = Sales.findAll({
      where: {
        seller_id: id,
      },
      include: [
        {
          model: Product,
          as: "product",
        },
        {
          model: User,
          attributes: { exclude: ["password"] },
          as: "buyer",
          include: {
            model: Address,
          },
        },
      ],
      order: [["created_at", "ASC"]],
    });
    return data;
  },
};
