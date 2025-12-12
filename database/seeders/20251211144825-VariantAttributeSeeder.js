'use strict';

const {faker} = require('@faker-js/faker');
const db = require("../../app/models/index");
const {meilisearch, syncAttributes} = require("../../config/meilisearch");
const {publishMessage} = require("../../app/services/Rabbitmq");

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
          as: 'product',
          attributes: ['name', 'description'],
          include: [{
            model: db.sequelize.models.Category,
            as: 'categories',
            attributes: ['name'],
            through: {'attributes': []}
          }]
        },
        {
          model: db.sequelize.models.VariantAttribute,
          as: 'attributes',
          attributes: ['name', 'value']
        }
      ]
    });
    let documents = [];
    variants.forEach(variant => documents.push(variant.get({plain: true})));
    await publishMessage({
      event: 'VariantsCreated',
      documents: documents,
      sortableAttributes: ['quantity_sold'],
      filterableAttributes: ['categories', 'attributes'],
      rankingRules: [
        "words",
        "typo",
        "proximity",
        "attribute",
        "sort",
        "exactness",
      ]
    }, 'products_exchange');
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     */
    await queryInterface.bulkDelete('variants_attributes', null);
    await publishMessage({event: 'AllVariantsDeleted'}, 'products_exchange');
  }
};
