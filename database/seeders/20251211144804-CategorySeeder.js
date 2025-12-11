'use strict';

const {faker} = require('@faker-js/faker');

function getCategory() {
  return {
    name: faker.commerce.department()
  };
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     */
    let categories = faker.helpers.multiple(getCategory, {count: 3});
    await queryInterface.bulkInsert('categories', categories);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     */
    await queryInterface.bulkDelete('categories', null);
  }
};
