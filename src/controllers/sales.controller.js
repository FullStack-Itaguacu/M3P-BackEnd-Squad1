const Sale = require('../models/sales');
const { errorLauncher } = require("../services/customs.errors.services.js");

module.exports = {
    async getSalesDashboardAdmin(req, res){
        try{
            if(req.user.type_user !== 'Admin'){
                return res.status(403).send({message: 'Acesso negado'});
            }

            const totalSales = await Sale.aggregate([
                {$match: {seller_id: req.user.user_id}},
                {$group: {_id: null, total: {$sum: "$value"}}}
            ]);

            const totalAmount = await Sale.countDocuments({seller_id: req.user.user_id});

            res.status(200).json({
                totalSales: totalSales.length > 0 ? totalSales[0].total : 0,
                totalAmount: totalAmount
            });
        } catch (error) {
            console.log(error);
            errorLauncher(error, res);
        }
    }
}



// module.exports={

//     async getSalesDashboardAdmin (req, res) {

//         if (req.user.TYPE_USER !== 'ADMIN') {
//             return res.status(403).send({ message: 'Acesso negado' });
//         }

//         const totalSales = await Sale.aggregate([
//             { $match: { seller_id: req.user.user_id } },
//             { $group: { _id: null, total: { $sum: "$value" } } }
//         ]);

//         const totalAmount = await Sale.countDocuments({ seller_id: req.user.user_id });

//         res.status(200).json({
//             totalSales: totalSales.length > 0 ? totalSales[0].total : 0,
//             totalAmount: totalAmount
//         });
//     }
// }

