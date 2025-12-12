'use strict'

const {
  DataTypes,
  Model,
} = require('sequelize');

module.exports = (sequelize) => {
  class Category extends Model {
    static associate(models) {
      Category.belongsToMany(models.Product, {
        through: 'products_categories',
        foreignKey: 'category_id',
        timestamps: false,
        as: 'products'
      });
    }
  }

  Category.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrementIdentity: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'Category',
    tableName: 'categories',
    timestamps: false,
  });

  return Category;
};
