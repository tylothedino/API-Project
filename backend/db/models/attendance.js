'use strict';
const { Model, Validator } = require('sequelize');

module.exports = (sequelize, DataTypes) => {


  class Attendance extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Attendance.belongsTo(models.User, {
        foreignKey: 'userId'
      });

      Attendance.belongsTo(models.Event, {
        foreignKey: 'eventId'
      });


    }
  }
  Attendance.init({
    eventId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    status: {
      type: DataTypes.ENUM,
      values: ['attending', 'waitlist', 'pending'],
      defaultValue: 'pending',
      allowNull: false,
      validate: {
        ifPending(val) {
          if (val.toLowerCase() === 'pending' && !this.status) {
            throw new Error('Cannot change an attendance status to pending')
          }
        },
        ifNotParams(val) {
          if (val.toLowerCase() !== 'attending' && val.toLowerCase() !== 'waitlist' && val.toLowerCase() !== 'pending') {
            throw new Error('Status must be attending or waitlist');
          }
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Attendance',
    hooks: true
  });
  return Attendance;
};
