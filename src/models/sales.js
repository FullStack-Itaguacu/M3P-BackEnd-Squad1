const { DataTypes, ENUM } = require("sequelize");
const connection = require("../database/connection");
const User = require("./user");
const Product = require("./product");
const UserAddress = require("./userAddress");

const Sales = connection.define(
  "sales",
  {
    buyer_id: {
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
    seller_id: {
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
    product_id: {
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
    users_addresses_id: {
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
    amount_buy: {
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
    type_payment: {
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
  },
  {
    paranoid: true,
    timestamps: true,
    underscored: true,
  }
  );

Sales.belongsTo(User, { foreignKey: 'buyer_id', as: 'buyer' });
Sales.belongsTo(User, { foreignKey: 'seller_id', as: 'seller' });
Sales.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });
Sales.belongsTo(UserAddress, { foreignKey: 'users_addresses_id', as: 'user_address' });

module.exports = {Sales};