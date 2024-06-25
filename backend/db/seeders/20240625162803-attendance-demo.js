"use strict";

const { Attendance } = require("../models");
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await Attendance.bulkCreate(
      [
        {
          userId: 1,
          eventId: 1,
          status: 'attending'
        },
        {
          userId: 2,
          eventId: 2,
          status: 'waitlist'
        },
        {
          userId: 3,
          eventId: 3,
          status: 'pending'
        },
        {
          userId: 3,
          eventId: 1,
          status: 'attending'
        },
      ],
      { validate: true }
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Attendances";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        userId: [1, 2, 3]
      },
      {}
    );
  },
};
