"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */

    await queryInterface.bulkInsert(
      "products",
      [
        {
          user_id: 1,
          name: "Dipirona",
          lab_name: "EMS",
          image_link:"https://www.imagelink.com",
          dosage: "750mg",
          unit_price: 5.0,
          total_stock: 100,
          type_product: "uncontrolled",
          description:
            "Dipirona é um medicamento utilizado para tratar dores de cabeça, febre e dores no corpo em geral.",
          created_at: new Date(),
          updated_at: new Date(),
        },{
          user_id: 1,
          name: "Aspirina",
          lab_name: "Bayer",
          image_link:"https://www.imagelink.com",
          dosage: "500mg",
          unit_price: 5.0,
          total_stock: 100,
          type_product: "uncontrolled",
          description:
            "Aspirina é um medicamento utilizado para tratar dores de cabeça, febre e dores no corpo em geral.",
          created_at: new Date(),
          updated_at: new Date(),
        },{
          user_id: 1,
          name: "Diasepam",
          lab_name: "Roche",
          image_link:"https://www.imagelink.com",
          dosage: "10mg",
          unit_price: 5.0,
          total_stock: 100,
          type_product: "controlled",
          description:
            "Diasepam é um medicamento utilizado para tratar o sono.",
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
