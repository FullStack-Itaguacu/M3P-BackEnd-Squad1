const User = require("../models/user");
const { errorLauncher } = require("../services/customs.errors.services.js");
const {
  verificaNumeroPositivo,
  verificaSomenteNumeros,
} = require("../services/validators");
const Address = require("../models/address");
require("../models/userAddress");
const {
  verifyCpfExist,
  verifyUserId,
  verifyEmailExist,
} = require("../services/user.services");

module.exports = {
  async updateOneBuyer(req, res) {
    try {
      const allowedFields = ["full_name", "email", "cpf", "phone", "type_user"];
      const receivedFields = Object.keys(req.body);

      const isValidOperation = receivedFields.every((field) =>
        allowedFields.includes(field)
      );

      if (!isValidOperation) {
        return res.status(403).send({
          status: 403,
          error: "ForbidenFields",
          message:
            "A requisição contém campos não permitidos para atualização.",
        });
      }

      const { user_id } = req.params;

      const { full_name, email, phone, cpf, type_user } = req.body;
      const data = await verifyUserId(user_id);

      await verificaNumeroPositivo(user_id, "user_id");
      await verificaSomenteNumeros(user_id, "user_id");

      const currentUser = await User.findByPk(user_id);

      if (currentUser.type_user === "Admin" && type_user === "Buyer") {
        return res.status(422).send({
          error: "BadFormatRequest",
          status: 422,
          message:
            "Não é possível trocar de ADMIN para BUYER. A única troca possível é de Buyer para Admin",
          cause: "Requisição mal formatada",
        });
      }
      if (type_user !== undefined) {
        if (type_user !== "Admin" && type_user !== "Buyer") {
          return res.status(422).json({
            error: "BadFormatRequest",
            status: 422,
            message: "O campo type_user deve ser Buyer ou Admin",
            cause: "Requisição mal formatada,",
          });
        }
      }
      if (cpf !== undefined) {
        await verifyCpfExist(cpf);
      }

      if (email !== undefined) {
        await verifyEmailExist(email);
      }

      if (full_name !== undefined && full_name.trim() === "") {
        return res.status(422).json({
          status: 422,
          error: "BadFormatRequest",
          message: "O campo full_name não pode ser uma string vazia.",
          cause: "Requisição mal formatada",
        });
      }
      if (full_name !== undefined) {
        data.full_name = full_name;
      }
      if (email !== undefined) {
        data.email = email;
      }
      if (phone !== undefined) {
        data.phone = phone;
      }
      if (cpf !== undefined) {
        data.cpf = cpf;
      }
      if (type_user) {
        data.type_user = type_user;
      }

      await data.save();

      return res.status(204).send({
        status: 204,
        message: "Dados atualizados com sucesso",
        data,
      });
    } catch (error) {
      errorLauncher(error, res);
    }
  },
};
