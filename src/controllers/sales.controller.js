const { Sales } = require("../models/sales");
const Product = require("../models/product");
const UserAddress = require("../models/userAddress");

const { errorLauncher } = require("../services/customs.errors.services");

module.exports = {
  async storeSale(req, res) {
    try {
      const array_of_sales = req.body;
      const buyer_id = req.payload.id;
      var sales_saved = [];
      var all_sales_pass = false;

      for (const sale of array_of_sales) {
        const { product_id, amount_buy, users_addresses_id, type_payment } =
          sale;
        const acepted_type_payment = [
          "credit_card",
          "debit_card",
          "payment_slip",
          "pix",
          "transfer",
        ];
        if (!acepted_type_payment.includes(type_payment)) {
          console.log("tipo de pagamento nao aceito");
          all_sales_pass = false;
        }
        const product = await Product.findByPk(product_id);
        if (!product) {
          console.log("produto nao encontrado");
          all_sales_pass = false;
        }
        if (product.total_stock < amount_buy) {
          console.log("quantidade comprada maior que o estoque");
          all_sales_pass = false;
        }
        const user_address = await UserAddress.findByPk(users_addresses_id);
        if (!user_address) {
          console.log("endereco nao encontrado");
          all_sales_pass = false;
        }
        all_sales_pass = true;
      }

      console.log(all_sales_pass);

      if (all_sales_pass) {
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
      } else {
        return res
          .status(400)
          .json({ error: "Nao e possivel realizar a venda." });
      }

      return res.status(201).json(sales_saved);
    } catch (error) {
      errorLauncher(error, res);
    }
  },
};
