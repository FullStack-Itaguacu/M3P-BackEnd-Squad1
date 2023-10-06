const Products = require("../models/product");

module.exports = {
  async listProducts(req, res) {
    try {
      const { offset, limit } = req.params;
      const { name, type_product } = req.query;
      const user_id =  req.payload.id;
        const products = await Products.findAll({
            where: {
                name: name,
                type_product: type_product,
                user_id: user_id
            },
            order : [['total_stock', 'DESC']],
      
        });
return res.status(200).json(
    {
        status: "200",
        products
    }
)
      
    } catch (error) {
      return res.send(error);
    }
  },
};
