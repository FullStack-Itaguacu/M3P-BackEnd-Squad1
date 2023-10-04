const { DataTypes, ENUM } = require("sequelize");
const connection = require("../database/connection");

const Sales = connection.define("sales", {
  buyerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isInt: true,
    },
  },
  sellerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isInt: true,
    },
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isInt: true,
    },
  },
  usersAddressesId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isInt: true,
    },
  },
  amountBuy: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isInt: true,
    },
  },
  total: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  typePayment: ENUM(
    "credit_card",
    "debit_card",
    "payment_slip",
    "pix",
    "transfer"
  ),

  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  deletedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
});

module.exports = { Sales };
