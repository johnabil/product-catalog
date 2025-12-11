'use strict';

const {faker} = require('@faker-js/faker');
const db = require("../../app/models/index");
const {meilisearch, syncAttributes} = require("../../config/meilisearch");

function fakeAttributes(variant_ids) {
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
    let variantsAttributes = faker.helpers.multiple(() => fakeAttributes(variant_ids), {count: 20000});
    await queryInterface.bulkInsert('variants_attributes', variantsAttributes);

    let variants = await db.sequelize.models.Variant.findAll({
      attributes: ['id', 'name', 'description', 'quantity_sold'],
      include: [
        {
          model: db.sequelize.models.Product,
          attributes: ['name', 'description'],
          include: [{model: db.sequelize.models.Category, attributes: ['name'], through: {'attributes': []}}]
        },
        {
          model: db.sequelize.models.VariantAttribute,
          attributes: ['name', 'value']
        }
      ]
    });
    let documents = [];
    const index = meilisearch.index('variants');
    variants.forEach(variant => documents.push(variant.get({plain: true})));
    await index.addDocuments(documents).waitTask();
    await syncAttributes(index, ['quantity_sold'], [
      "words",
      "typo",
      "proximity",
      "attribute",
      "sort",
      "exactness",
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     */
    await queryInterface.bulkDelete('variants_attributes', null);
    await meilisearch.index('variants').deleteAllDocuments().waitTask();
  }
};
