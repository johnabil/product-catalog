'use strict'

const {
  DataTypes,
  Model,
} = require('sequelize');

module.exports = (sequelize) => {
  class VariantAttribute extends Model {
    static associate(models) {
      VariantAttribute.belongsTo(models.Variant, {foreignKey: 'variant_id', as: 'variant'});
    }
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
    timestamps: false
  });

  return VariantAttribute;
};
