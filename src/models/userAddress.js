const { DataTypes } = require("sequelize");
const connection = require("../database/connection");
const User = require("./user.js");
const Address = require("./address.js");

const UserAddress = connection.define(
  "users_addresses",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    address_id: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    users_addresses_id: {
      field: 'id',
      type: DataTypes.INTEGER,
    }

  },
  {
    timestamps: true,
    paranoid: true,
    underscored: true,
  }
);

User.belongsToMany(Address, {
  through: UserAddress,
  foreignKey: "user_id",
});

Address.belongsToMany(User, {
  through: UserAddress,
  foreignKey: "address_id",
});

UserAddress.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

UserAddress.belongsTo(Address, {
  foreignKey: "address_id",
  as: "address",
});


module.exports = UserAddress;
