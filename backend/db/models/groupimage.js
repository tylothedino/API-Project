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
      allowNull: false,
      validate: {
        correctFile(value) {
          //Check to see if the ends are a file type
          const fileType = ['.jpg', '.png', '.jpeg'];

          if (!fileType.find((type) => value.slice(-6).includes(type))) {
            throw new Error("Image URL must end in .png, .jpg, or .jpeg")

          }
        }
      }
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
