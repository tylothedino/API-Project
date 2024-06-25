'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Attendance extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Attendance.belongsTo(
        models.User, { foreignKey: 'userId' }
      );

      Attendance.belongsTo(
        models.Event, { foreignKey: 'eventId' }
      );

    }
  }
  Attendance.init({
    eventId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      onDelete: 'CASCADE',
      references: { model: 'Events' }
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      onDelete: 'CASCADE',
      references: { model: 'Users' }
    },
    status: {
      type: DataTypes.ENUM('attending', 'pending', 'waitlist')
    }
  }, {
    sequelize,
    modelName: 'Attendance',
  });
  return Attendance;
};
