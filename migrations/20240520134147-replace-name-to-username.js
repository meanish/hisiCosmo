'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.renameColumn('users', 'name', 'username');
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.renameColumn('users', 'username', 'name');
  }
};
