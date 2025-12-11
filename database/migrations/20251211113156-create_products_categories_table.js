'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     */
    await queryInterface.createTable('products_categories', {
      product_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {model: 'Product', key: 'id'},
      },
      category_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {model: 'Category', key: 'id'},
      },
    })
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     */
    await queryInterface.dropTable('products_categories');
  }
};
