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

      Event.hasMany(models.EventImage, {
        foreignKey: 'eventId', onDelete: 'CASCADE', hooks: true
      });

      Event.hasMany(models.Attendance, {
        foreignKey: 'eventId', onDelete: 'CASCADE', hooks: true
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
      allowNull: {
        args: false,
        msg: "Description is required"
      },
      validate: {
        isNull(val) {
          if (!val) {
            throw new Error("Description is required");
          }
        }
      }
    },
    type: {
      type: DataTypes.ENUM,
      values: ['Online', 'In person'],
      allowNull: false,
      validate: {
        checkType(value) {
          if (value.toLowerCase() !== 'online' && value.toLowerCase() !== 'in person') {
            throw new Error("Type must be Online or In person")
          }
        }
      }
    },
    capacity: {
      type: DataTypes.INTEGER,
      validate: {
        isInt: true
      },
      allowNull: false,
      validate: {
        checkInt(val) {
          if (typeof val !== 'number') {
            throw new Error("Capacity must be an integer")
          }
        }
      }
    },
    price: {
      type: DataTypes.FLOAT,
      validate: {
        isValid(val) {
          if (val < 0 || typeof val !== 'number') {
            throw new Error("Price is invalid");
          }
        }
      }
    },
    startDate: {
      type: DataTypes.DATE,
      validate: {
        isFuture(val) {
          const date = new Date();
          if (date.getTime() > val.getTime() && val.getTime() === this.startDate.getTime()) {
            throw new Error("Start date must be in the future");
          }
        },
        isBeforeEnd(val) {
          if (val.getTime() > this.endDate.getTime()) {
            throw new Error("Your start date cannot be ahead of your end date")
          }
        }
      }
    },
    endDate: {
      type: DataTypes.DATE,
      validate: {
        isFuture(val) {
          if (val.getTime() <= this.startDate.getTime()) {
            throw new Error("End date is less than start date");
          }
        }
      },

    },
  }, {
    sequelize,
    modelName: 'Event',
    defaultScope: {
      attributes: ['id', 'groupId', 'venueId', 'name', 'type', 'startDate', 'endDate']
    }
  });
  return Event;
};
