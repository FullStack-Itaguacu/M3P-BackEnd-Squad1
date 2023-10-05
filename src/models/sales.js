const { DataTypes, ENUM } = require("sequelize");
const connection = require("../database/connection");
const User = require("./user");
const Product = require("./product");
const UserAddress = require("./userAddress");

const Sales = connection.define(
  "sales",
  {
    buyerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: true,
        notNull: true,
        async isExistingUser(value) {
          const user = await sequelize.models.User.findByPk(value);
          if (!user) {
            throw new Error('O comprador não existe na tabela users.');
          }
        },
      }
    },
    sellerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: true,
        notNull: true,
        async isExistingUser(value) {
          const user = await sequelize.models.User.findByPk(value);
          if (!user) {
            throw new Error('O vendedor não existe na tabela users.');
          }
        },
      }
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: true,
        notNull: true,
        async isExistingProduct(value) {
          const product = await sequelize.models.Product.findByPk(value);
          if (!product) {
            throw new Error('O produto não existe na tabela products.');
          }
        },
      }
    },
    usersAddressesId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: true,
        notNull: true,
        async isExistingUserAddress(value) {
          const address = await sequelize.models.UserAddress.findByPk(value);
          if (!address) {
            throw new Error('O endereço do usuário não existe na tabela users_addresses.');
          }
        },
      }
    },
    amountBuy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: true,
        notNull: true,
        async isLessThanTotalStock(value) {
          const product = await sequelize.models.Product.findByPk(this.productId);
          if (product && value > product.total_stock) {
            throw new Error('A quantidade comprada é maior do que o estoque disponível.');
          }
        }
      }
    },
    total: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: true,
        notNull: true
      }
    },
    typePayment: {
      type: DataTypes.ENUM(
        "credit_card",
        "debit_card",
        "payment_slip",
        "pix",
        "transfer"
      ),
      allowNull: false,
      validate: {
        notNull: true
      }
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notNull: true,
        isDate: true
      }
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notNull: true,
        isDate: true
      }
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      validate: {
        isDate: true
      }
    }
  });

Sales.belongsTo(User, { foreignKey: 'buyerId', as: 'buyer' });
Sales.belongsTo(User, { foreignKey: 'sellerId', as: 'seller' });
Sales.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
Sales.belongsTo(UserAddress, { foreignKey: 'usersAddressesId', as: 'userAddress' });

module.exports = {Sales};