'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {


    await queryInterface.changeColumn('Products', 'discount', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });


    // Remove the discount_start and discount_end fields
    await queryInterface.removeColumn('Products', 'discount_start');
    await queryInterface.removeColumn('Products', 'discount_end');
  },


  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.changeColumn('Products', 'discount', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
    });

    await queryInterface.addColumn('Products', 'discount_start', {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.addColumn('Products', 'discount_end', {
      type: Sequelize.DATE,
      allowNull: true,
    });


  }
};
