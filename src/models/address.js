const Sequelize = require("sequelize");
const connection = require("../database/connection");


const Address = connection.define("addresses", {

  number_street: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  street: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  neighborhood: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  city: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  state: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  zip: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  complement: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  lat: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  long: {
    type: Sequelize.STRING,
    allowNull: true,
  },
}, {
  timestamps: true,
  paranoid: true,
  underscored: true,
});

module.exports = Address;
