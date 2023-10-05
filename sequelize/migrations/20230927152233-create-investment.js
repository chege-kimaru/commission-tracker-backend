'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('investments', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT',
        references: {
          model: 'users',
          key: 'id',
        },
      },
      investor_id: {
        type: Sequelize.UUID,
        allowNull: false,
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT',
        references: {
          model: 'investors',
          key: 'id',
        },
      },
      project: {
        type: Sequelize.STRING
      },
      typology: {
        type: Sequelize.STRING
      },
      unit_number: {
        type: Sequelize.STRING
      },
      price: {
        type: Sequelize.DOUBLE
      },
      commission_percentage: {
        type: Sequelize.DOUBLE
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
    await queryInterface.dropTable('investments');
  }
};