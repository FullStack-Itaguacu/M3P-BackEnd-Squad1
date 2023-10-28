const Sequelize = require("sequelize");
const connection = require("../database/connection");


const Product = connection.define(
  "products",
  {
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: {
            status: 500,
            cause: "O campo userId é obrigatório.",
          },
        },
        isNumeric: {
          msg: {
            status: 500,
            cause: "O campo userId deve ser um valor inteiro numérico.",
          },
        },
      },
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: {
            status: "422",
            cause: "O campo name é obrigatório.",
          },
        },
      },
    },
    lab_name: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: {
            status: 422,
            cause: "O campo labName é obrigatório.",
          },
        },
      },
    },
    image_link: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: {
            status: 422,
            cause: "O campo imageLink é obrigatório.",
          },
        },
      },
    },
    dosage: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: {
            status: 422,
            cause: "O campo dosage é obrigatório.",
          },
        },
      },
    },
    unit_price: {
      type: Sequelize.NUMBER,
      allowNull: false,
      validate: {
        isNumeric: {
          msg: {
            status: "400",
            cause: "O campo unitPrice deve ser numérico.",
          },
          notNull: {
            msg: {
              status: "422",
              cause: "O campo unitPrice é obrigatório.",
            },
          },
        },
      },
    },
    total_stock: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        isNumeric: {
          msg: {
            status: "400",
            cause: "O campo totalStock deve ser numérico.",
          },
          notNull: {
            msg: {
              status: "422",
              cause: "O campo totalStock é obrigatório.",
            },
          },
        },
      },
    },
    type_product: {
      type: Sequelize.ENUM("controlled", "uncontrolled"),
      allowNull: false,
      validate: {
        isIn: {
          statuscode: 400,
          args: [["controlled", "uncontrolled"]],
          msg: 'Somente são aceitos os valores: ( uncontrolled ) e ( controlled ) no campo type_product.',
        },
      },
    },

    description: {
      type: Sequelize.STRING,
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

module.exports = Product;
