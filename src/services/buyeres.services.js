const User = require("../models/user.js");
const { Op } = require("sequelize");
const {
  OffsetIsNan,
  LimitIsNan,
  NumberNotPositive,
  CreatedAtBadValueReceived,
  UserNotFound,
} = require("../services/customs.errors.services.js");
module.exports = {
  async filtroBodyOffsetLimitSearch(offset, limit, full_name, created_at) {
    if (isNaN(offset)) {
      throw new OffsetIsNan();
    }
    if (isNaN(limit)) {
      throw new LimitIsNan();
    }
    if (offset < 0) {
      throw new NumberNotPositive("offset");
    }
    if (limit < 0) {
      throw new NumberNotPositive("limit");
    }
    /* limitando a quantidade de itens por página a 20,
     * caso o usuário tente passar um valor maior que 20
     * valor será setado em 20 para nao quebrar a paginação .
     */
    limit > 20 ? (limit = 20) : (limit = limit);
    /**
     * se offset for menor que 1, será setado em 1
     * para não quebrar a paginação.
     */
    offset < 1 ? (offset = 1) : (offset = offset);
  },
  async searchOffsetLimit(
    start,
    items_for_page,
    actual_page,
    full_name,
    created_at,
    res,
    User
  ) {
    if (created_at !== "ASC" && created_at !== "DESC") {
      throw new CreatedAtBadValueReceived();
    }
    full_name = full_name.toLowerCase();
    User.findAndCountAll({
      attributes: {
        exclude: ["password"],
      },
      where: {
        full_name: {
          [Op.or]: [
            {
              [Op.like]: `${full_name}`,
            },
            {
              [Op.like]: `${full_name.toUpperCase()}`,
            },
            {
              [Op.like]: `%${full_name}%`,
            },
            {
              [Op.like]: `%${full_name[0].toUpperCase() + full_name.slice(1)}%`,
            },
          ],
        },
      },
      offset: start,
      limit: items_for_page,
      order: [["created_at", created_at]],
    })
      .then((result) => {
        const total_users = result.count;
        const total_pages = Math.ceil(total_users / items_for_page);
        var next_page = actual_page < total_pages ? actual_page + 1 : 0;
        var prev_page = actual_page > 1 ? actual_page - 1 : 0;

        if (actual_page > 1) {
          prev_page = actual_page - 1;
        }

        if (actual_page >= total_pages) {
          next_page = 1;
        }
        const users = result.rows;
        if (users.length == 0) {
          return res.sendStatus(204);
        }
        return res.status(200).json({
          status: "200",
          total_users,
          items_for_page,
          total_pages,
          prev_page,
          next_page,
          actual_page,
          users,
        });
      })
      .catch((error) => {
        return error;
      });
  },
  async verificaUserId(user_id) {
    const data = await User.findOne({
      where: {
        id: user_id,
      },
      attributes : {
        exclude : ["password"]
      }
    });

    if (data === null) {
      throw new UserNotFound();
    }

    return data;
  },
};
