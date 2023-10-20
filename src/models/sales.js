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
          const user = await User.findByPk(value);
          if (!user) {
            throw new Error("O comprador não existe na tabela users.");
          }
        },
      },
    },
    seller_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: true,
        notNull: true,
        async isExistingUser(value) {
          const user = await User.findByPk(value);
          if (!user) {
            throw new Error("O vendedor não existe na tabela users.");
          }
        },
      },
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: true,
        notNull: true,
        async isExistingProduct(value) {
          const product = await Product.findByPk(value);
          if (!product) {
            throw new Error("O produto não existe na tabela products.");
          }
        },
      },
    },
    users_addresses_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: true,
        notNull: true,
        async isExistingUserAddress(value) {
          const address = await UserAddress.findByPk(value);
          if (!address) {
            throw new Error(
              "O endereço do usuário não existe na tabela users_addresses."
            );
          }
        },
      },
    },
    amount_buy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: true,
        notNull: true,
        async isLessThanTotalStock(value) {
          console.log(`value: ${value}`)
          const product = await Product.findByPk(this.product_id);
          console.log(`product: ${product}`)
          if (product && value > product.total_stock) {
            throw new Error(
              "A quantidade comprada é maior do que o estoque disponível."
            );
          }
        },
      },
    },
    total: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        isNumeric: {
          args: true,
          msg: "O total da venda deve ser um valor numérico, e não pode ser nulo.",
        },
        notNull: true,
      },
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
        notNull: true,
      },
    },
  },
  {
    underscored: true,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at",
    paranoid: true,
    tableName: "sales",
  }
);

Sales.belongsTo(User, { foreignKey: "buyer_id", as: "buyer" });
Sales.belongsTo(User, { foreignKey: "seller_id", as: "seller" });
Sales.belongsTo(Product, { foreignKey: "product_id", as: "product" });
Sales.belongsTo(UserAddress, {
  foreignKey: "users_addresses_id",
  as: "user_address",
});

module.exports = { Sales };
