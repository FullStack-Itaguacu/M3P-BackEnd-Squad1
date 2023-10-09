const  {Sales}  = require("../models/sales");
const Product = require("../models/product");

const { errorLauncher } = require("../services/customs.errors.services");

module.exports = {
  async storeSale(req, res) {
    try {
      const { product_id, amount_buy, users_addresses_id, type_payment } =
        req.body;
      const buyer_id = req.payload.id;

      const product = await Product.findByPk(product_id);

      const seller_id = product.user_id;

      const total = Number.parseFloat(amount_buy )*  Number.parseFloat(product.unit_price);

      const sale = await Sales.create({
        seller_id,
        buyer_id,
        product_id,
        amount_buy,
        users_addresses_id,
        type_payment,
        total,
      });
      return res.status(201).json(sale);
    } catch (error) {
        console.log(error)
      errorLauncher(error, res);
    }
  },
};
