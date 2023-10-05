const Sequelize = require("sequelize");
const connection = require("../database/connection");
const { validaSenha, validaEmail } = require("../services/validators");

const User = connection.define(
  "users",
  {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    full_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: {
        validaEmail,
      },
    },
    cpf: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: {
          args: [11, 11],
          msg: "O CPF deve ter 11 caracteres",
        },
      },
    },
     phone: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        validaSenha,
      },
    },
    birth_date: {
      type: Sequelize.DATEONLY,
      allowNull: false,
      validate: {
        isDate: {
          msg: "Data inválida",
        },
      },
    },
    type_user: {
      type: Sequelize.ENUM("Admin", "Buyer"),
      allowNull: false,
      defaultValue: "Buyer",
    },
    created_by: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    paranoid: true,
    timestamps: true,
    underscored: true,
  }
);

module.exports = User;
