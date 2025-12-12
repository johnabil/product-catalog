'use strict';

const {faker} = require('@faker-js/faker');
const db = require("../../app/models/index");
const {meilisearch, syncAttributes} = require("../../config/meilisearch");
const {publishMessage} = require("../../app/services/Rabbitmq");

function fakeAttributes(variant_ids) {
  const types = ['Material', 'Specification'];
  let type = faker.helpers.arrayElement(types);
  let value;
  switch (type) {
    case 'Material':
      value = faker.commerce.productMaterial();
      break;
    case 'Specification':
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

    const variant_columns = ['id', 'name', 'description', 'quantity_sold', 'price', 'quantity'];
    let variants = await db.sequelize.models.Variant.findAll({
      attributes: variant_columns,
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
    let documents = variants.map(variant => {
      const product = {
        name: variant.product.name,
        description: variant.product.description,
        categories: variant.product?.categories.map(category => category.name),
      };
      return {
        id: variant.id,
        name: variant.name,
        description: variant.description,
        price: variant.price,
        quantity: variant.quantity,
        quantity_sold: variant.quantity_sold,
        product: product,

        attributes: variant.attributes?.reduce((acc, attribute) => {
          acc[attribute.name] = attribute.value;
          return acc;
        }, {}),
      }
    });
    await publishMessage({
      event: 'VariantsCreated',
      documents: documents,
      sortableAttributes: ['quantity_sold'],
      filterableAttributes: ['product.categories', 'attributes', 'price', 'quantity'],
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
