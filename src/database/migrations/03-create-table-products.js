'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.createTable('products', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
        allowNull: false
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: { model: "users", key: "id" },
        allowNull: false
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      lab_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      image_link: {
        type: Sequelize.STRING,
        allowNull: false
      },
      dosage: {
        type: Sequelize.STRING,
        allowNull: false
      },
      unit_price: {
        type: Sequelize.REAL,
        allowNull: false
      },
      total_stock: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      type_product: {
        type: Sequelize.ENUM("Controled Medicine", "Uncontroled Medication"),
        allowNull: false
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true,
        default: null
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true
      }
    });

  },

  async down(queryInterface, Sequelize) {

    await queryInterface.dropTable('products');

  }
};
