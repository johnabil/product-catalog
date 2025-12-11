'use strict';

const {faker} = require('@faker-js/faker');
const timestamp = new Date().toLocaleString("en-GB");

function fakeUser() {
  return {
    name: faker.internet.displayName(),
    email: faker.internet.email(),
    password: '123456',
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
    let users = faker.helpers.multiple(fakeUser, {count: 1000});
    await queryInterface.bulkInsert('users', users);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     */
    await queryInterface.bulkDelete('users', null);
  }
};
