'use strict';

const {faker} = require('@faker-js/faker');
const timestamp = new Date().toISOString();

function fakeSupplier() {
  return {
    name: faker.company.name(),
    email: faker.internet.email(),
    password: '123456',
    image: faker.image.url(),
    created_at: timestamp,
    updated_at: timestamp
  };
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     */
    let suppliers = faker.helpers.multiple(fakeSupplier, {count: 30});
    await queryInterface.bulkInsert('suppliers', suppliers);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     */
    await queryInterface.bulkDelete('suppliers', null);
  }
};
