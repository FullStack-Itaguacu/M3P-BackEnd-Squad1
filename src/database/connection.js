const Sequelize = require('sequelize');
const allConfigs = require('../config/database.config');
const config = allConfigs[process.env.NODE_ENV];
const connection = new Sequelize(config);

module.exports = connection;