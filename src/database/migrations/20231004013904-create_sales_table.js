'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('sales', {
      id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
        type: Sequelize.INTEGER
      },
      buyer_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      seller_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      product_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'products',
          key: 'id'
        }
      },
      users_addresses_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'users_addresses',
          key: 'id'
        }
      },
      amount_buy: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      total: {
        allowNull: false,
        type: Sequelize.FLOAT
      },
      type_payment: {
        allowNull: false,
        type: Sequelize.ENUM('Cartão de crédito', 'Cartão de débito', 'Pix', 'Boleto', 'Transferência bancária')
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deleted_at: {
        type: Sequelize.DATE
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('sales');
  }
};
