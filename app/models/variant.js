'use strict'

const {
  DataTypes,
  Model,
} = require('sequelize');

module.exports = (sequelize) => {
  class Variant extends Model {
    static associate(models) {
      Variant.belongsTo(models.Product, {foreignKey: 'product_id'});
    }
  }

  Variant.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrementIdentity: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    image: {
      type: DataTypes.STRING,
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    currency: {
      type: DataTypes.STRING,
      defaultValue: 'EGP'
    },
    quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    quantity_sold: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {model: 'Product', key: 'id'},
    },
    created_at: {
      type: DataTypes.DATE,
    },
    updated_at: {
      type: DataTypes.DATE,
    },
  }, {
    sequelize,
    modelName: 'Variant',
    tableName: 'variants',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  return Variant;
};
