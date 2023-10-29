const User = require("../models/user");
const { errorLauncher } = require("../services/user.services.js");
const Address = require("../models/address");
require("../models/userAddress");
const {
  verifyCpfExist,
  verifyUserId,
  verifyEmailExist,
} = require("../services/user.services");
const {
  filtroBodyOffsetLimitSearch,
  searchOffsetLimit,
  verificaUserId,
  filtroBodyUpdateBuyer,
} = require("../services/buyer.services.js");
const { verificaNumeroPositivo, verificaSomenteNumeros } = require("../services/validators");

module.exports = {
  async getBuyersOffsetLimit(req, res) {
    try {
      let { full_name, created_at } = req.query;
      let { offset, limit } = req.params;

      await filtroBodyOffsetLimitSearch(offset, limit);

      const items_for_page = parseInt(limit);
      const actual_page = parseInt(offset);
      //calculo para saber o inicio da paginação no banco de dados
      let start = parseInt((actual_page - 1) * items_for_page);
      //se o start for menor que 0, será setado em 0 para não quebrar a paginação
      start < 0 ? (start = 0) : (start = start);

      if (!full_name) {
        full_name = '%'
      }

      if (!created_at) {
        created_at = 'ASC'
      }

      await searchOffsetLimit(
        start,
        items_for_page,
        actual_page,
        full_name,
        created_at,
        res,
        User)

    } catch (error) {
      errorLauncher(error, res);
    }
  },
  async getBuyersAdresses(req, res) {
    try {
      const payload = req.payload;
      const user_id = payload.id;

      const user = await User.findByPk(user_id, {
        atributtes: {
          exclude: ["password"],
        },
        include: {
          association: "addresses",
        },
      });
      if (user.addresses.length == 0) {
        return res.status(404).json({
          message:
            "Não há endereços cadastrados para este usuário e isto nao deveria acontecer, por favor contate o suporte caso ache que se trata de um erro ,ou cadastre um endereço para este usuário.",
          status: 404,
          cause: "Não ha endereços cadastrados para este usuário",
          error: "NotFoundAdress",
        });
      }

      return res.status(200).json(user.addresses);
    } catch (error) {
      errorLauncher(error, res);
    }
  },
  async listOneBuyer(req, res) {
    try {

      const { user_id } = req.params

      await verificaNumeroPositivo(user_id, "user_id")
      await verificaSomenteNumeros(user_id, "user_id")

      const data = await verificaUserId(user_id)

      return res.status(200).json({
        status: 200,
        message: "Sucesso",
        data
      })
    } catch (error) {
      errorLauncher(error, res)
    }
  },
  async updateOneBuyer(req, res) {
    try {
      const allowedFields = ["full_name", "email", "cpf", "phone", "type_user"];
      const receivedFields = Object.keys(req.body);
      const isValidOperation = receivedFields.every((field) =>
        allowedFields.includes(field)
      );

      if (!isValidOperation) {
        return res.status(422).json({
          status: 422,
          error: "BadFormatRequest",
          message:
            "A requisição contém campos não permitidos para atualização.",
        });
      }

      const { user_id } = req.params;

      await verificaNumeroPositivo(user_id, "user_id");
      await verificaSomenteNumeros(user_id, "user_id");

      const newData = req.body;
      const dataInBD = await verifyUserId(user_id);

      if (dataInBD.type_user !== "Buyer") {
        return res.status(422).json({
          status: 422,
          error: "TypeUserNotBuyer",
          message: "Usuário não é um 'Buyer'.",
          cause: "O usuário a ser atualizado deve ser do tipo 'Buyer'.",
        });
      }

      if (dataInBD.type_user === "Admin" && type_user === "Buyer") {
        return res.status(422).json({
          error: "BadFormatRequest",
          status: 422,
          message:
            "Não é possível trocar de Admin para Buyer. A única troca possível é de Buyer para Admin",
          cause: "Requisição mal formatada",
        });
      }
      if (newData.type_user !== undefined) {
        if (newData.type_user !== "Admin" && newData.type_user !== "Buyer") {
          return res.status(400).json({
            error: "BadFormatRequest",
            status: 400,
            message: "O campo type_user deve ser Buyer ou Admin",
            cause: "Requisição mal formatada,",
          });
        }
      }
      if (newData.cpf !== undefined && newData.cpf !== dataInBD.cpf) {
        await verifyCpfExist(newData.cpf);
      }

      if (newData.email !== undefined && newData.email !== dataInBD.email) {
        await verifyEmailExist(newData.email);
      }

      await filtroBodyUpdateBuyer(newData);

      await User.update({
        full_name: newData.full_name,
        email: newData.email,
        phone: newData.phone,
        cpf: newData.cpf,
        type_user: newData.type_user
      },
        {
          where: {
            id: user_id
          }
        });

      return res.status(204).json({});
    } catch (error) {
      errorLauncher(error, res);
    }
  },
};
