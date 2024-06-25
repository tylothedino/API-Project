"use strict";

const { Venue } = require("../models");
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}


module.exports = {
  async up(queryInterface, Sequelize) {
    await Venue.bulkCreate(
      [
        {
          groupId: 1,
          address: "123 Disney Lane",
          city: "New York",
          state: "NY",
          lat: 37.7645358,
          lng: -122.4730327
        },
        {
          groupId: 2,
          address: "173 New Sherman",
          city: "Denver",
          state: "CO",
          lat: 40.7645358,
          lng: -130.4730327
        },
        {
          groupId: 3,
          address: "1259 S. Walleybee Shermy",
          city: "Maine",
          state: "FL",
          lat: -10.358,
          lng: 30.734
        },
        {
          groupId: 3,
          address: "1254 N. Polefto Dr",
          city: "Kyoto",
          state: "JP",
          lat: 87.358,
          lng: -170.734
        },
      ],
      { validate: true }
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Venues";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        city: ['NY', 'JP', 'FL', 'CO']
      },
      {}
    );
  },
};
