'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('Shipping', 'name', 'fullname');
    await queryInterface.renameColumn('Shipping', 'number', 'phone_number');

    // Modify the phone_number column type to INTEGER
    await queryInterface.changeColumn('Shipping', 'phone_number', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Revert the changes if needed
    await queryInterface.renameColumn('Shipping', 'fullname', 'name');
    await queryInterface.renameColumn('Shipping', 'phone_number', 'number');

    // Revert the phone_number column type back to STRING
    await queryInterface.changeColumn('Shipping', 'phone_number', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  }
};
