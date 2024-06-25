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
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Attendance',
  });
  return Attendance;
};
