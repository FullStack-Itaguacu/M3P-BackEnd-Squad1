const connection = require("../database/connection");
const { DataTypes } = require("sequelize");

const UserAddress = connection.define("users_addresses", {
    user_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
      address_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      created_at: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updated_at: {
        allowNull: false,
        type: DataTypes.DATE
      },
      deleted_at: {
        type: DataTypes.DATE
      }
    },
});

module.exports = UserAddress;
