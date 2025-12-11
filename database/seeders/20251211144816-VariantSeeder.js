'use strict';

const {faker} = require('@faker-js/faker');
const timestamp = new Date();

function fakeVariants(product_ids) {
  return {
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    image: faker.image.url(),
    price: faker.commerce.price(),
    currency: 'EGP',
    quantity: faker.number.int({min: 1, max: 10000}),
    quantity_sold: faker.number.int({min: 1, max: 10000}),
    product_id: faker.helpers.arrayElement(product_ids),
    created_at: timestamp,
    updated_at: timestamp
  };
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let [{product_ids}] = await queryInterface.sequelize.query(
      `SELECT array_agg(id) AS product_ids
       FROM "products";`,
      {type: Sequelize.QueryTypes.SELECT}
    );
    let variants = faker.helpers.multiple(() => fakeVariants(product_ids), {count: 100});
    await queryInterface.bulkInsert('variants', variants);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     */
    await queryInterface.bulkDelete('variants', null);
  }
};
