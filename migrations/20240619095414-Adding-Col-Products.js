'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('products', 'product_description', {
      type: Sequelize.TEXT('long'),
      allowNull: true,
    });
    await queryInterface.addColumn('products', 'status', {
      type: Sequelize.ENUM('enabled', 'disabled'),
      allowNull: false,
      defaultValue: 'enabled',
    });
    await queryInterface.addColumn('products', 'slug', {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('products', 'product_description');
    await queryInterface.removeColumn('products', 'status');
    await queryInterface.removeColumn('products', "slug")
  }
};
