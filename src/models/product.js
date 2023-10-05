const Sequelize = require("sequelize");
const connection = require("../database/connection");

const Product = connection.define(
    'products', {
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
            notNull: {
                msg: {
                    status: "422",
                    cause: "O campo userId é obrigatório."
                }
            },
            isNumeric: {
                msg: {
                    status: "422",
                    cause: "O campo userId deve ser um valor inteiro numérico."
                }
            }
        }
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: {
                    status: "422",
                    cause: "O campo name é obrigatório."
                }
            }
        }
    },
    labName: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: {
                    status: "422",
                    cause: "O campo labName é obrigatório."
                }
            }
        }
    },
    imageLink: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: {
                    status: "422",
                    cause: "O campo imageLink é obrigatório."
                }
            }
        }
    },
    dosage: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: {
                    status: "422",
                    cause: "O campo dosage é obrigatório."
                }
            }
        }
    },
    unitPrice: {
        type: Sequelize.NUMBER,
        allowNull: false,
        validate: {
            isNumeric: {
                msg: {
                    status: "400",
                    cause: "O campo unitPrice deve ser numérico."
                },
                notNull: {
                    msg: {
                        status: "422",
                        cause: "O campo unitPrice é obrigatório."
                    }
                }
            }
        }
    },
    totalStock: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            isNumeric: {
                msg: {
                    status: "400",
                    cause: "O campo totalStock deve ser numérico."
                },
                notNull: {
                    msg: {
                        status: "422",
                        cause: "O campo totalStock é obrigatório."
                    }
                }
            }
        }
    },
    typeProduct: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            isIn: {
                args: [["Controlled Medicine", "Uncontrolled Medication"]],
                msg: {
                    status: "400",
                    cause: "Somente são aceitos os valores: 'Controlled Medicine' e 'Uncontrolled Medication' no campo typeProduct."
                },
                notNull: {
                    msg: {
                        status: "422",
                        cause: "O campo typeProduct é obrigatório."
                    }
                }
            }
        }
    },
    description: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null
    },
    createdAt: {
        type: Sequelize.DATE,
        allowNull: false
    },
    updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
    },
    deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null
    }
},
    {
        paranoid: true,
        timestamps: true,
        underscored: true,
    }
);

module.exports = Product;