const { Sales } = require("../models/sales");
const Product = require("../models/product");
const UserAddress = require("../models/userAddress");

const { errorLauncher } = require("../services/customs.errors.services");

module.exports = {
  async getSalesDashboardAdmin(req, res) {
    try {
      console.log("req.user:", req.user); 
      if (req.user && req.user.type_user === 'Admin') {
        const sellerId = req.user.seller_id;
        console.log("sellerId:", sellerId); // Adicione esta linha para verificar o valor de sellerId

        const totalSales = await Sales.sum('total', {
          where: { seller_id: sellerId },
        });

        const totalAmount = await Sales.sum('amount_buy', {
          where: { seller_id: sellerId },
        });

        return res.status(200).json({
          statusCode: 200,
          message: 'Dashboard de vendas obtido com sucesso',
          dados: {
            totalSales: totalSales || 0,
            totalAmount: totalAmount || 0,
          },
        });
      }

      return res.status(401).json({
        statusCode: 401,
        message: 'Não autorizado',
        erro: 'UnauthorizedError',
        cause: 'Somente administradores podem acessar este recurso',
      });
    } catch (error) {
      console.error(error);
      errorLauncher(error, res);
    }
  }


}  