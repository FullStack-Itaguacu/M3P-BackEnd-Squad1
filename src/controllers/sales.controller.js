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
  verifyArrayOfSales,
} = require("../services/sale.services");

module.exports = {
  async storeSale(req, res) {
    try {
      const array_of_sales = req.body;
      const { id, full_name } = req.payload;

      await verifyArrayOfSales(array_of_sales);

      let sales_saved = [];
      let valor_total_da_compra = 0;
      let address = null;

      for (const sale of array_of_sales) {
        const { product_id, amount_buy, users_addresses_id } =
          sale;
        await isAllMandatoryFields(sale);

        const product = await Product.findByPk(product_id);
        if (!product) {
          throw new ProductNotFound();
        }
        if (product.total_stock < amount_buy) {
          throw new CustomizableError(
            "AmountBuyNotAcepted",
            "A quantidade de produtos disponíveis é menor do que a quantidade que você deseja comprar.",
            `Estoque de ${product.name} insuficiente para finalizar a compra`,
            409
          );
        }
        const user_address = await UserAddress.findByPk(users_addresses_id);
        if (!user_address) {
          throw new CustomizableError(
            "UserAddressNotFound",
            `O endereço informado não tem relação com o usuario ${full_name}.`,
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
          buyer_id: id,
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
        user_address: address,
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
        include: [
          {
            model: Product,
            as: "product",
            attributes: {
              exclude: ["unit_price", "total_stock", "user_id", "createdAt", "updatedAt", "deletedAt"]
            }
          },
          {
            model: UserAddress,
            as: "user_address",
            attributes: ["id"],
            include: [
              {
                model: Address,
                as: "address",
                attributes: ["street", "neighborhood", "city", "state", "zip", "number_street", "complement"],
              },
            ],
          },
        ]
      });

      if (sales.length === 0) {
        return res.status(204).end();
      }

      res.status(200).json(sales);
    } catch (error) {
      errorLauncher(error, res);
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
