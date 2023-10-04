const { DataTypes, ENUM } = require("sequelize");
const connection = require("../database/connection");
const User = require("./user");
const Product = require("./product"); // Falta saber qual nome vai ser dado ao model de produtos
const UserAddress = require("./userAddress");

const Sales = connection.define(
  "sales",
  {
    buyerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: {
            msg: "O comprador deve ser um número inteiro",
            },
        notNull: true,
        async isExistingUser(value) {
          const user = await Sequelize.models.user.findByPk(value);
          if (!user) {
            throw new Error("O comprador não existe");
          }
        },
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
  },
  {
    paranoid: true,
    underscored: true,
  }
);

Sales.belongsTo(User, {
  foreignKey: "buyerId",
  targetKey: "id",
  as: "buyer",
});

Sales.belongsTo(User, {
  foreignKey: "sellerId",
  targetKey: "id",
  as: "seller",
});

Sales.belongsTo(Product, {
  foreignKey: "productId",
  targetKey: "id",
  as: "product",
});

Sales.belongsTo(UserAddress, {
  foreignKey: "usersAddressesId",
  targetKey: "id",
  as: "userAddress",
});

module.exports = { Sales };
