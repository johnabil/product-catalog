'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     */
    await queryInterface.createTable('variants', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
      },
      image: {
        type: Sequelize.STRING,
      },
      price: {
        type: Sequelize.DECIMAL(10, 10),
        allowNull: false,
      },
      currency: {
        type: Sequelize.STRING,
        defaultValue: 'EGP'
      },
      quantity: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      quantity_sold: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      product_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {model: 'Product', key: 'id'},
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     */
    await queryInterface.dropTable('variants');
  }
};
