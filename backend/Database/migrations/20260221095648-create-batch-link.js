'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('BatchLinks', {
      parent_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'Batches', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      child_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'Batches', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    // Composite primary key — a pair can only exist once
    await queryInterface.addConstraint('BatchLinks', {
      fields: ['parent_id', 'child_id'],
      type: 'primary key',
      name: 'batch_links_pkey',
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('BatchLinks');
  },
};