'use strict'

const {
  DataTypes,
  Model,
} = require('sequelize');
const {formatVariants} = require('../../config/meilisearch');
const {publishMessage} = require("../services/Rabbitmq");
const variant_columns = ['id', 'name', 'description', 'quantity_sold', 'price', 'quantity'];

module.exports = (sequelize) => {
  class VariantAttribute extends Model {
    static associate(models) {
      VariantAttribute.belongsTo(models.Variant, {foreignKey: 'variant_id', as: 'variant'});
    }
  }

  //Get variants with its relations
  async function getVariants(variant_ids) {
    return await sequelize.models.Variant.findAll({
      where: {id: variant_ids},
      attributes: variant_columns,
      include: [
        {
          model: sequelize.models.Product,
          as: 'product',
          attributes: ['name', 'description'],
          include: [{
            model: sequelize.models.Category,
            as: 'categories',
            attributes: ['name'],
            through: {'attributes': []}
          }]
        },
        {
          model: sequelize.models.VariantAttribute,
          as: 'attributes',
          attributes: ['name', 'value']
        }
      ]
    });
  }

  VariantAttribute.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrementIdentity: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    value: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    variant_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {model: 'Variant', key: 'id'},
    }
  }, {
    sequelize,
    modelName: 'VariantAttribute',
    tableName: 'variants_attributes',
    timestamps: false,
    hooks: {
      //Updating meilisearch indexes on variant attribute creation, update or deletion
      afterCreate: async (variantAttribute) => {
        let variants = getVariants([variantAttribute.variant_id]);
        let documents = await formatVariants(variants);
        await publishMessage({
          event: 'VariantsCreated',
          documents: documents,
          sortableAttributes: [],
          filterableAttributes: [],
          rankingRules: []
        }, 'products_exchange');
      },
      afterUpdate: async (variantAttribute) => {
        let variants = getVariants([variantAttribute.variant_id]);
        let documents = await formatVariants(variants);
        await publishMessage({
          event: 'VariantsUpdated',
          documents: documents,
          sortableAttributes: [],
          filterableAttributes: [],
          rankingRules: []
        }, 'products_exchange');
      },
      afterDestroy: async (variantAttribute) => {
        let variants = getVariants([variantAttribute.variant_id]);
        let documents = await formatVariants(variants);
        await publishMessage({
          event: 'VariantsDeleted',
          documents: documents,
          sortableAttributes: [],
          filterableAttributes: [],
          rankingRules: []
        }, 'products_exchange');
      },
    }
  });

  return VariantAttribute;
};
