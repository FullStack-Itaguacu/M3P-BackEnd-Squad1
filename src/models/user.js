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
          msg: "O CPF deve ter exatamente 11 caracteres",
        },
        isNumeric: {
          msg: "O CPF deve conter apenas números sem pontos ou traços ex: 12345678910",
        },
      },
    },
     phone: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [10, 15],
          msg: "O telefone deve ter entre 10 e 15 caracteres",
        },
        isNumeric: {
          msg: "O telefone deve conter apenas números sem pontos ou traços ex: 12345678910",
        },
      },
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
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
