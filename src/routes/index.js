const router = require('express').Router();
const homeRoutes = require('./v1/home');
const { routesFromUser } = require('./v1/user.routes');
const { routesFromProducts } = require('./v1/products.routes');
const productsRoutes = require('./v1/products.routes');


router.use('/api', [routesFromUser(), routesFromProducts()])

module.exports = router