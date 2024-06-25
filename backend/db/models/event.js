'use strict';
const { Model, Validator } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Event.belongsTo(models.Venue, {
        foreignKey: 'venueId'
      });

      Event.belongsTo(models.Group, {
        foreignKey: 'groupId'
      });
    }
  }
  Event.init({
    venueId: DataTypes.INTEGER,
    groupId: DataTypes.INTEGER,
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        atLeastFive(value) {
          if (value.length < 5) {
            throw new Error("Name must be at least 5 characters")
          }
        }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM,
      values: ['Online', 'In person'],
      allowNull: false
    },
    capacity: {
      type: DataTypes.INTEGER,
      validate: {
        isInt: true
      },
      allowNull: false
    },
    price: {
      type: DataTypes.FLOAT
    },
    startDate: {
      type: DataTypes.DATE,
    },
    endDate: {
      type: DataTypes.DATE

    }
  }, {
    sequelize,
    modelName: 'Event',
  });
  return Event;
};
