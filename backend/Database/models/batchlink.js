'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class BatchLink extends Model {
    static associate(models) {
      // Associations handled from Batch side
    }
  }

  BatchLink.init({
    parent_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
    child_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
  }, {
    sequelize,
    modelName: 'BatchLink',
  });

  return BatchLink;
};