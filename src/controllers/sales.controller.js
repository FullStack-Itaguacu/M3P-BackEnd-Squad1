const { Sales } = require("../models/sales");
const Product = require("../models/product");
const UserAddress = require("../models/userAddress");

const { errorLauncher } = require("../services/customs.errors.services");

module.exports = {
  async getSalesDashboardAdmin(req, res) {
    try {
     
      if (req.user && req.user.type_user === 'Admin') {
       
        const totalSales = await Sales.sum('total');
  
        const totalAmount = await Sales.sum('amount_buy');
  
        return res.status(200).json({
          statusCode: 200,
          message: 'Dashboard de vendas obtido com sucesso',
          dados: {
            totalSales: totalSales || 0,
            totalAmount: totalAmount || 0,
          },
         
        });
      }
  
      // Se req.user não é um administrador, retorne um erro 401
      return res.status(401).json({
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Você não tem permissão para acessar este recurso. Apenas administradores são autorizados.',
      });
    } catch (error) {
      console.error(error);
      errorLauncher(error, res);
    }
  },
}  