'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    await queryInterface.addColumn("products", "discount", {
      type: Sequelize.FLOAT,
      allowNull: true,

    });
    await queryInterface.addColumn("products", "discount_start", {
      type: Sequelize.DATE,
      allowNull: true,

    });
    await queryInterface.addColumn("products", "discount_end", {
      type: Sequelize.DATE,
      allowNull: true,

    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    await queryInterface.removeColumn("products", "discount");
    await queryInterface.removeColumn("products", "discount_start");
    await queryInterface.removeColumn("products", "discount_end")

  }
};
