const { Sales } = require("../models/sales");
const Product = require("../models/product");
const UserAddress = require("../models/userAddress");
const Address = require("../models/address");
require("../models/userAddress");
const {
  CustomizableError,
  ProductNotFound,
} = require("../services/customs.errors.services");
const { errorLauncher } = require("../services/customs.errors.services");
const { isAllMandatoryFields } = require("../services/sales.services");

module.exports = {
  async storeSale(req, res) {
    try {
      const array_of_sales = req.body;
      const buyer_id = req.payload.id;

      var sales_saved = [];
      var valor_total_da_compra = 0;
      var address = null;

      for (const sale of array_of_sales) {
        const { product_id, amount_buy, users_addresses_id, type_payment } =
          sale;
          await isAllMandatoryFields(sale);
        const acepted_type_payment = [
          "credit_card",
          "debit_card",
          "payment_slip",
          "pix",
          "transfer",
        ];
        if (!acepted_type_payment.includes(type_payment)) {
          throw new CustomizableError(
            "TypePaymentNotAcepted",
            `Informou um tipo de pagamento não aceito, tente com ${acepted_type_payment}.`,
            "Metodo de pagamento não compativel",
            400
          );
        }
        const product = await Product.findByPk(product_id);
        if (!product) {
          throw new ProductNotFound();
        }
        console.log(product.total_stock, amount_buy);
        if (product.total_stock < amount_buy) {
          throw new CustomizableError(
            "AmountBuyNotAcepted",
            "A quantidade de produtos disponiveis é menor do que a quantidade que você deseja comprar.",
            `Stock de ${product.name} insuficiente para finalizar a compra`,
            409
          );
        }
        const user_address = await UserAddress.findByPk(users_addresses_id);
        if (!user_address) {
          throw new CustomizableError(
            "UserAddressNotFound",
            `O endereço informado não tem relaçao com o id de usuario ${buyer_id}.`,
            "Endereço não encontrado em nossa base de dados",
            404
          );
        }
        address = await Address.findByPk(user_address.address_id);
      }

      for (const sale of array_of_sales) {
        const { product_id, amount_buy, users_addresses_id, type_payment } =
          sale;

        const product = await Product.findByPk(product_id);
        const total = product.unit_price * amount_buy;
        const seller_id = product.user_id;

        const success_sale = await Sales.create({
          buyer_id,
          seller_id,
          product_id,
          users_addresses_id,
          amount_buy,
          type_payment,
          total,
        });
        if (success_sale) {
          product.total_stock = product.total_stock - amount_buy;
          product.save();
        }

        sales_saved.push(success_sale);
      }
      valor_total_da_compra = sales_saved.reduce((acc, sale) => {
        return acc + sale.total;
      }, 0);

      return res.status(201).json({
        message:
          "Sua compra  foi cadastrada com sucesso, nossos colaboradores ja estão preparando seu pedido!!!",
        status: 201,
        valor_total_da_compra,
        pedido: sales_saved,
        usser_adress: address,
      });
    } catch (error) {
      errorLauncher(error, res);
    }
  },

  async listSales (req, res) {
    const user_id = req.payload.id;

    try {
      const sales = await Sales.findAll({
        where: { buyer_id: user_id},
      })

      if (sales.length === 0) {
        return res.status(204).end();
      }

      res.status(200).json(sales);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro interno do servidor" })
    }
  },
};
