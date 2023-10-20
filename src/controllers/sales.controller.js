const { Sales } = require("../models/sales");
const Product = require("../models/product");
const UserAddress = require("../models/userAddress");
const Address = require("../models/address");
require("../models/userAddress");
const {
  CustomizableError,
  ProductNotFound,
  errorLauncher,
} = require("../services/customs.errors.services");
const {
  isAllMandatoryFields,
  findAdminSales,
} = require("../services/sales.services");

module.exports = {
  async storeSale(req, res) {
    try {
     
      const array_of_sales = req.body;
       if (!Array.isArray(array_of_sales) || array_of_sales.length === 0 || !array_of_sales.some(obj => Object.keys(obj).length > 0)) {
        throw new CustomizableError("InvalidRequest", "O corpo da requisição deve conter pelo menos um objeto dentro do array.", "Requisição inválida", 422);
    }
      const buyer_id = req.payload.id;
      
      if (array_of_sales && array_of_sales.length === 0) {
        throw new CustomizableError(
          "EmptyArray",
          "Não podemos processar sua compra, recebemos um array vazio",
          "Foi informado um array de compras vazio",
          418
        );
      }

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

  async listSales(req, res) {
    const user_id = req.payload.id;

    try {
      const sales = await Sales.findAll({
        where: { buyer_id: user_id },
      });

      if (sales.length === 0) {
        return res.status(204).end();
      }

      res.status(200).json(sales);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  },

  async getSalesDashboardAdmin(req, res) {
    try {
      const payload = req.payload;

      if (payload && payload.type_user === "Admin") {
        const sellerId = payload.id;

        const totalSales = await Sales.sum("total", {
          where: { seller_id: sellerId },
        });

        const totalAmount = await Sales.sum("amount_buy", {
          where: { seller_id: sellerId },
        });

        return res.status(200).json({
          statusCode: 200,
          message: "Dashboard de vendas obtido com sucesso",
          dados: {
            totalSales: totalSales || 0,
            totalAmount: totalAmount || 0,
          },
        });
      }

      return res.status(401).json({
        statusCode: 401,
        message: "Não autorizado",
        erro: "UnauthorizedError",
        cause: "Somente administradores podem acessar este recurso",
      });
    } catch (error) {
      console.error(error);
      errorLauncher(error, res);
    }
  },
  async listSalesAdmin(req, res) {
    try {
      const { id } = req.payload;

      const data = await findAdminSales(id);

      if (data.length === 0) {
        return res.status(204).json();
      }
      return res.status(200).json({
        data,
      });
    } catch (error) {
      errorLauncher(error, res);
    }
  },
};
