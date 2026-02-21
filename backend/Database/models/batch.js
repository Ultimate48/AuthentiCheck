'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Batch extends Model {
    static associate(models) {
      Batch.belongsTo(models.SupplyMember, { foreignKey: 'producer_id', as: 'Producer' });
      Batch.belongsTo(models.SupplyMember, { foreignKey: 'shipped_to_id', as: 'ShippedTo' });

      // A batch can have many children and many parents via BatchLinks
      Batch.belongsToMany(models.Batch, {
        through: models.BatchLink,
        foreignKey: 'parent_id',
        otherKey: 'child_id',
        as: 'Children',
      });
      Batch.belongsToMany(models.Batch, {
        through: models.BatchLink,
        foreignKey: 'child_id',
        otherKey: 'parent_id',
        as: 'Parents',
      });
    }
  }

  Batch.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    producer_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    shipped_to_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    data: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    signature: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Batch',
  });

  return Batch;
};