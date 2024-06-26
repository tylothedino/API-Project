
'use strict';
const { Model, Validator } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    //User Association
    static associate(models) {
      Group.belongsTo(models.User, {
        foreignKey: 'organizerId'

      });

      Group.hasMany(models.Event, {
        foreignKey: 'groupId', onDelete: 'CASCADE', hooks: true
      });

      Group.hasMany(models.Membership, {
        foreignKey: 'groupId', onDelete: 'CASCADE', hooks: true
      });

      Group.hasMany(models.GroupImage, {
        foreignKey: 'groupId', onDelete: 'CASCADE', hooks: true
      });

    }
  }


  Group.init({
    organizerId: DataTypes.INTEGER,
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        lessThanSixty(value) {
          if (value.length > 60) {
            throw new Error("Name must be 60 characters or less")
          }
        }
      }
    },
    about: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        fiftyChar(value) {
          if (value.length < 50) {
            throw new Error("About must be 50 characters or more")
          }
        }
      }
    },
    type: {
      type: DataTypes.ENUM,
      values: ['Online', 'In person'],
      allowNull: false,
      validate: {
        correctValues(values) {
          if (values.toLowerCase() !== 'online' || values.toLowerCase() !== 'in person') {
            throw new Error("Type must be 'Online' or 'In person'");
          }
        }
      }
    },
    private: {
      type: {
        type: DataTypes.BOOLEAN,
        msg: 'Private must be a boolean!'
      },
      allowNull: false,
      validate: {
        isBoolean(value) {
          if (value !== true && value !== false)
            throw new Error('Private must be a boolean');
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
        isNull(value) {
          if (!value) {
            throw new Error('City is required');
          }
        }
      }
    },
    state: {
      type: DataTypes.STRING,
      allowNull: {
        args: false,
        msg: 'State is required'
      },
      validate: {
        isNull(value) {
          if (!value) {
            throw new Error('State is required');
          }
        }
      }
    },

  }, {
    sequelize,
    modelName: 'Group',
  });
  return Group;
};
