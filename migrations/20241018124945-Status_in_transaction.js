'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Alter the 'status' column to replace the ENUM values
    await queryInterface.changeColumn('transaction', 'status', {
      type: Sequelize.ENUM('PENDING', 'COMPLETE', 'FULL_REFUND', 'CANCELED'),
      defaultValue: 'PENDING',
    });
  },

  async down(queryInterface, Sequelize) {
    // Revert the 'status' column back to its previous ENUM values
    await queryInterface.changeColumn('transaction', 'status', {
      type: Sequelize.ENUM('initiated', 'success', 'failed', 'pending'),
      defaultValue: 'initiated',
    });
  }
};
