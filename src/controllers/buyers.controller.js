const User = require("../models/user");
const { errorLauncher } = require("../services/customs.errors.services.js");
const {
  filtroBodyOffsetLimitSearch,
  searchOffsetLimit,
  verificaUserId,
} = require("../services/buyeres.services.js");
const { verificaNumeroPositivo, verificaSomenteNumeros } = require("../services/validators");

module.exports = {
  async getBuyersOffsetLimit(req, res) {
    try {
      const { full_name, created_at } = req.query;
      var { offset, limit } = req.params;

      await filtroBodyOffsetLimitSearch(offset, limit, full_name, created_at);

      const items_for_page = parseInt(limit);
      const actual_page = parseInt(offset);
      //calculo para saber o inicio da paginação no banco de dados
      var start = parseInt((actual_page - 1) * items_for_page);
      //se o start for menor que 0, será setado em 0 para não quebrar a paginação
      start < 0 ? (start = 0) : (start = start);

      //para garantir a busca, o nome do produto será buscado em 3 variações (lowercase, uppercase e capitalize)
      const name_variation = [
        full_name.toLowerCase(),
        full_name.toUpperCase(),
        (nameCapitalize = full_name[0].toUpperCase() + full_name.slice(1)),
      ];

      await searchOffsetLimit(
        start,
        items_for_page,
        actual_page,
        name_variation,
        created_at,
        res,
        User
      );
    } catch (error) {
      errorLauncher(error, res);
    }
  },
  async getBuyersAdresses(req, res) {
    try {
      const payload = req.payload;
      const user_id = payload.id;

      const user = await User.findByPk(user_id, {

        include: {
          association: "addresses",
        },

      });
      if (user.addresses.length == 0) {
        return res.status(404).json({
          message: "Não há endereços cadastrados para este usuário e isto nao deveria acontecer, por favor contate o suporte caso ache que se trata de um erro ,ou cadastre um endereço para este usuário.",
          status: 404,
          cause: "Não ha endereços cadastrados para este usuário",
          error: "NotFoundAdress"
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

      return res.status(200).send({
        status: 200,
        message: "Sucesso",
        data
      })
    } catch (error) {
      errorLauncher(error, res)
    }
  }
};
