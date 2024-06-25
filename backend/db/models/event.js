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
      type: DataTypes.INTEGER
    },
    startDate: {
      type: DataTypes.DATE,
      validate: {
        isAfter: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    },
    endDate: {
      type: DataTypes.DATE,

      //Would this work?
      validate: {
        isAfter: this.startDate
      }

    }
  }, {
    sequelize,
    modelName: 'Event',
  });
  return Event;
};
