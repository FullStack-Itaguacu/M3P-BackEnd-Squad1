const router = require('express').Router();
const { routesFromUser } = require('./v1/user.routes');
const { routesFromProducts } = require('./v1/products.routes');
const { routesFromBuyers } = require('./v1/buyers.routes');
const { routesFromSales } = require('./v1/sales.routes');

router.use('/api', [
    routesFromUser(), 
    routesFromProducts(),
    routesFromBuyers(),
    routesFromSales()
])

module.exports = router