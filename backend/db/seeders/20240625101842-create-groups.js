"use strict";

const { Group } = require("../models");
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await Group.bulkCreate(
      [
        {
          organizerId: 1,
          name: "Evening Tennis on the Water",
          about: "Enjoy rounds of tennis with a tight-nit group of people on the water facing the Brooklyn Bridge. Singles or doubles.",
          type: "In person",
          private: true,
          city: "New York",
          state: "NY",
        },
        {
          organizerId: 2,
          name: "Gambling at Vegas",
          about: "Enjoy a bus-ride to Vegas where you can satisfy your gambling needs.",
          type: "In person",
          private: false,
          city: "Houston",
          state: "TX",
        },
        {
          organizerId: 2,
          name: "Hiking in the Morning",
          about: "Have fun getting in the morning sun on a hike up Crescent Hill, the most beautiful hike in Chicago.",
          type: "In person",
          private: false,
          city: "Chicago",
          state: "IL",
        },
        {
          organizerId: 3,
          name: "Raid on Neomuna",
          about: "Welcome to the Fireteam Guardian, it's time to raid Neomuna as the Vex have invaded.",
          type: "Online",
          private: true,
          city: "Los Angeles",
          state: "CA",
        },
      ],
      { validate: true }
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Groups";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        state: ['CA', 'IL', 'NY', 'TX']
      },
      {}
    );
  },
};
