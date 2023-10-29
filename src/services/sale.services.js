const { Sales } = require("../models/sales");
const Product = require("../models/product");
const Address = require("../models/address");
require("../models/userAddress");

const { CustomizableError } = require("../services/customs.errors.services");
const User = require("../models/user");
const { verificaSomenteNumeros } = require("./validators");
module.exports = {
  async isAllMandatoryFields(sale) {
    const { product_id, amount_buy, users_addresses_id, type_payment } = sale;
    const acepted_type_payment = [
      "credit_card",
      "debit_card",
      "payment_slip",
      "pix",
      "transfer",
    ];

    if (!product_id || product_id === "") {
      throw new CustomizableError(
        "FieldProductIdNotInformed",
        "O campo product_id não foi enviado na requisição.",
        "O campo product_id não foi informado.",
        422
      );
    }
    await verificaSomenteNumeros(product_id, "product_id");

    if (!amount_buy && amount_buy !== 0) {
      throw new CustomizableError(
        "FieldAmountBuyNotInformed",
        "O campo amount_buy não foi enviado na requisição.",
        "O campo amount_buy não foi informado.",
        422
      );
    }
    if (amount_buy <= 0) {
      throw new CustomizableError(
        "AmountBuyNegative",
        "Não podemos processar sua compra, a quantidade de produtos não pode ser menor ou igual a zero",
        "Foi informado um valor de quantidade de produtos menor ou igual a zero",
        400
      );
    }
    await verificaSomenteNumeros(amount_buy, "amount_buy");

    if (!users_addresses_id && users_addresses_id !== 0) {
      throw new CustomizableError(
        "FieldUserAddressIdNotInformed",
        "O campo users_addresses_id não foi enviado na requisição.",
        "O campo users_addresses_id não foi informado.",
        422
      );
    }
    if (users_addresses_id <= 0) {
      throw new CustomizableError(
        "UsersAddressesNegative",
        "Não podemos processar sua compra, o campo users_addresses_id não pode ser menor ou igual a zero",
        "Foi informado o campo users_addresses_id com valor menor ou igual a zero",
        400
      );
    }
    await verificaSomenteNumeros(users_addresses_id, "users_addresses_id");

    if (!type_payment || type_payment === "") {
      throw new CustomizableError(
        "FieldTypePaymentNotInformed",
        "O campo type_payment não foi enviado na requisição.",
        "O campo type_payment não foi informado.",
        422
      );
    }

    if (!acepted_type_payment.includes(type_payment)) {
      throw new CustomizableError(
        "TypePaymentNotAcepted",
        `Informou um tipo de pagamento não aceito, tente com ${acepted_type_payment}.`,
        "Metodo de pagamento não compativel",
        400
      );
    }
  },
  async verifyArrayOfSales(array_of_sales) {
    if (Object.keys(array_of_sales).length === 0) {
      throw new CustomizableError(
        "EmptyArray",
        "Não podemos processar sua compra, recebemos um array vazio",
        "Foi informado um array de compras vazio",
        422
      );
    }

    if (array_of_sales && array_of_sales.length === 0) {
      throw new CustomizableError(
        "EmptyArray",
        "Não podemos processar sua compra, recebemos um array vazio",
        "Foi informado um array de compras vazio",
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
