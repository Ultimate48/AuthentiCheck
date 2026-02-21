'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class SupplyMember extends Model {
    static associate(models) {
      SupplyMember.hasMany(models.Batch, { foreignKey: 'producer_id', as: 'ProducedBatches' });
      SupplyMember.hasMany(models.Batch, { foreignKey: 'shipped_to_id', as: 'ReceivedBatches' });
    }
  }

  SupplyMember.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    entity_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    public_key: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('active', 'suspended', 'revoked'),
      allowNull: false,
      defaultValue: 'active',
    },
  }, {
    sequelize,
    modelName: 'SupplyMember',
  });

  return SupplyMember;
};