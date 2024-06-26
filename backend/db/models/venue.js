'use strict';
const { Model, Validator } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Venue extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Venue.belongsTo(models.Group, {
        foreignKey: 'groupId'

      });

      Venue.hasMany(models.Event, {
        foreignKey: 'venueId', onDelete: 'CASCADE', hooks: true
      })

    }
  }

  Venue.init({
    groupId: DataTypes.INTEGER,
    address: {
      type: DataTypes.STRING,
      allowNull: {
        args: false,
        message: 'Address is required'
      },
      validate: {
        isNull(val) {
          if (!val) {
            throw new Error('Address is required');
          }
        }
      }
    },
    city: {
      type: DataTypes.STRING,
      allowNull: {
        args: false,
        msg: 'City is required'
      },
      validate: {
        isNull(val) {
          if (!val) {
            throw new Error('City is required');
          }
        }
      }
    },
    state: {
      type: DataTypes.STRING,
      allowNull: {
        args: false,
        message: 'State is required'
      },
      validate: {
        isNull(val) {
          if (!val) {
            throw new Error('State is required');
          }
        }
      }
    },
    lat: {
      type: DataTypes.DECIMAL,
      validate: {
        isBtwn(value) {
          if (value > 90 || value < -90) {
            throw new Error('Latitude must be within -90 and 90')
          }
        }

      }
    },
    lng: {
      type: DataTypes.DECIMAL,
      validate: {
        isBtwn(value) {
          if (value > 180 || value < -180) {
            throw new Error('Longitude must be within -180 and 180')
          }
        }

      }
    }
  }, {
    sequelize,
    modelName: 'Venue',
  });
  return Venue;
};
