'use strict';
const { Model, Validator } = require('sequelize');

module.exports = (sequelize, DataTypes) => {

  class GroupImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      GroupImage.belongsTo(models.Group, {
        foreignKey: 'groupId'
      });

    }
  }
  GroupImage.init({
    groupId: DataTypes.INTEGER,
    url: {
      type: DataTypes.STRING,
      allowNull: false
    },
    preview: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'GroupImage',
    defaultScope: {
      attributes: {
        exclude: ['createdAt', 'updatedAt']
      }
    }
  });
  return GroupImage;
};
