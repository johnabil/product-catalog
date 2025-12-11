'use strict'

const {
  DataTypes,
  Model,
} = require('sequelize');

module.exports = (sequelize) => {
  class Product extends Model {
    static associate(models) {
      Product.belongsTo(models.Supplier, {foreignKey: 'supplier_id'});
      Product.hasMany(models.Variant, {foreignKey: 'product_id'});
      Product.belongsToMany(models.Category, {through: 'products_categories', foreignKey: 'product_id'});
    }
  }

  Product.init({
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
    supplier_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {model: 'Supplier', key: 'id'},
    },
    created_at: {
      type: DataTypes.DATE,
    },
    updated_at: {
      type: DataTypes.DATE,
    },
  }, {
    sequelize,
    modelName: 'Product',
    tableName: 'products',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  return Product;
};
