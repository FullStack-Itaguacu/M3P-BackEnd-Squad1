'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query('ALTER TYPE enum_products_type_product ADD VALUE \'controlled\'');
    await queryInterface.sequelize.query('ALTER TYPE enum_products_type_product ADD VALUE \'uncontrolled\'');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query('ALTER TYPE enum_products_type_product DROP VALUE \'Controlled Medicine\'');
    await queryInterface.sequelize.query('ALTER TYPE enum_products_type_product DROP VALUE \'Uncontrolled Medicine\'');
  }
};

