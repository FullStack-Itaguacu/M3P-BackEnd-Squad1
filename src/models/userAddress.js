const { DataTypes } = require("sequelize");
const connection = require("../database/connection");
const  User  = require("./user");
const  Address  = require("./address");

const UserAddress = connection.define("users_addresses", {
  userId: {
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  addressId: {
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
  },
  updatedAt: {
    allowNull: false,
    type: DataTypes.DATE,
  },
  deletedAt: {
    type: DataTypes.DATE,
  },

});

UserAddress.associate = (models) => {
  UserAddress.belongsTo(models.User, {
    foreignKey: "userId",
    as: "users",
  });
  UserAddress.belongsTo(models.Address, {
    foreignKey: "addressId",
    as: "addresses",
    underscored: true,
    paranoid: true,
  });
}



module.exports = {UserAddress};
