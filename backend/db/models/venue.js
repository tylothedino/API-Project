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
      allowNull: false
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lat: {
      type: DataTypes.DECIMAL,
      validate: {
        min: -90,
        max: 90
      }
    },
    lng: {
      type: DataTypes.DECIMAL,
      validate: {
        min: -180,
        max: 180
      }
    }
  }, {
    sequelize,
    modelName: 'Venue',
  });
  return Venue;
};
