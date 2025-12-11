'use strict';

const {faker} = require('@faker-js/faker');

function fakeVariants(variant_ids) {
  const types = ['Material', 'Made by'];
  let type = faker.helpers.arrayElement(types);
  let value;
  switch (type) {
    case 'Material':
      value = faker.commerce.productMaterial();
      break;
    case 'Made by':
      value = faker.commerce.productAdjective();
      break;
    default:
      break;
  }
  return {
    name: type,
    value: value,
    variant_id: faker.helpers.arrayElement(variant_ids)
  };
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let [{variant_ids}] = await queryInterface.sequelize.query(
      `SELECT array_agg(id) AS variant_ids
       FROM "variants";`,
      {type: Sequelize.QueryTypes.SELECT}
    );
    let variants = faker.helpers.multiple(() => fakeVariants(variant_ids), {count: 40});
    await queryInterface.bulkInsert('variants_attributes', variants);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     */
    await queryInterface.bulkDelete('variants_attributes', null);
  }
};
