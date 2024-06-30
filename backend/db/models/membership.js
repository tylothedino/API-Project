'use strict';
const { Model, Validator } = require('sequelize');

module.exports = (sequelize, DataTypes) => {

  class Membership extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Membership.belongsTo(models.User, {
        foreignKey: 'userId'
      });

      Membership.belongsTo(models.Group, {
        foreignKey: 'groupId'
      })
    }
  }
  Membership.init({
    userId: DataTypes.INTEGER,
    groupId: DataTypes.INTEGER,
    status: {
      type: DataTypes.ENUM,
      values: ['co-host', 'member', 'pending'],
      validate: {
        ifNotParams(val) {
          if (val.toLowerCase() !== 'co-host' && val.toLowerCase() !== 'member' && val.toLowerCase() !== 'pending') {
            throw new Error('Status must be co-host or member');
          }
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Membership',
    hooks: true
  });
  return Membership;
};
