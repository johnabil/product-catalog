'use strict';

const {faker} = require('@faker-js/faker');
const timestamp = new Date().toLocaleString("en-GB");

function fakeProducts(supplier_ids) {
  const supplier_id = faker.helpers.arrayElement(supplier_ids);
  return {
    name: faker.commerce.product(),
    description: faker.commerce.productDescription(),
    image: faker.image.url(),
    supplier_id: supplier_id,
    created_at: timestamp,
    updated_at: timestamp
  };
}

function fakeProductCategories(product_ids, category_ids) {
  return {
    product_id: faker.helpers.arrayElement(product_ids),
    category_id: faker.helpers.arrayElement(category_ids)
  }
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    //get supplier ids to inject it into products
    let [{supplier_ids}] = await queryInterface.sequelize.query(
      `SELECT array_agg(id) AS supplier_ids
       FROM "suppliers";`,
      {type: Sequelize.QueryTypes.SELECT}
    );
    let products = faker.helpers.multiple(() => fakeProducts(supplier_ids), {count: 500});
    await queryInterface.bulkInsert('products', products);

    //inject product ids and category ids into products_categories
    let [{product_ids}] = await queryInterface.sequelize.query(
      `SELECT array_agg(id) AS product_ids
       FROM "products";`,
      {type: Sequelize.QueryTypes.SELECT}
    );
    let [{category_ids}] = await queryInterface.sequelize.query(
      `SELECT array_agg(id) AS category_ids
       FROM "categories";`,
      {type: Sequelize.QueryTypes.SELECT}
    );
    let products_categories = faker.helpers.multiple(() =>
      fakeProductCategories(product_ids, category_ids), {count: 30});
    await queryInterface.bulkInsert('products_categories', products_categories);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('products', null);
  }
};
