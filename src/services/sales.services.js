const { Sales } = require("../models/sales");
const Product = require("../models/product");
const Address = require("../models/address");
require("../models/userAddress");

const { CustomizableError } = require("../services/customs.errors.services");
const User = require("../models/user");

module.exports = {
  async isAllMandatoryFields(sale) {
    const { product_id, amount_buy, users_addresses_id, type_payment } = sale;

    const invalidFields = [];
    if (!product_id || isNaN(product_id)) {
      invalidFields.push("product_id");
    }
    if (!amount_buy || isNaN(amount_buy)) {
      invalidFields.push("amount_buy");
    }
    if (!users_addresses_id || isNaN(users_addresses_id)) {
      invalidFields.push("users_addresses_id");
    }
    const acceptedPaymentTypes = ["credit_card", "debit_card", "payment_slip", "pix", "transfer"];
    if (!type_payment || !acceptedPaymentTypes.includes(type_payment)) {
      invalidFields.push("type_payment");
    }

    if (invalidFields.length > 0) {
      throw new CustomizableError(
        "InvalidFields",
        `Campos inválidos ou não informados: ${invalidFields.join(", ")}.`,
        "Campos inválidos",
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
