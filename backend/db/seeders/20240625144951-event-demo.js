"use strict";

const { Event } = require("../models");
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}


module.exports = {
  async up(queryInterface, Sequelize) {
    await Event.bulkCreate(
      [
        {
          venueId: 1,
          groupId: 1,
          name: "Tennis Group First Meet and Greet",
          type: "Online",
          capacity: 10,
          price: 18.50,
          description: "The first meet and greet for our group! Come say hello!",
          startDate: "2024-11-19 20:00:00",
          endDate: "2024-11-19 22:00:00",
        },
        // {
        //   venueId: 1,
        //   groupId: 1,
        //   name: "Tennis Group First Meet and Greet",
        //   type: "Online",
        //   capacity: 10,
        //   price: 18.50,
        //   description: "The first meet and greet for our group! Come say hello!",
        //   startDate: "2023-11-19 20:00:00",
        //   endDate: "2023-11-19 22:00:00",
        // },
        {
          venueId: 2,
          groupId: 2,
          name: "Basketball Group First Meet and Greet",
          type: "In person",
          capacity: 30,
          price: 0,
          description: "The first meet and greet for our group! Come say hello!",
          startDate: "2024-11-19 20:00:00",
          endDate: "2024-11-19 23:00:00",
        },
        {
          venueId: 3,
          groupId: 3,
          name: "Baseball Group First Meet and Greet",
          type: "In person",
          capacity: 30,
          price: 19.49,
          description: "The first meet and greet for our group! Come say hello!",
          startDate: "2024-11-19 20:00:00",
          endDate: "2024-11-19 23:00:00",
        },
        {
          venueId: 2,
          groupId: 2,
          name: "Basketball Watchalong",
          type: "Online",
          capacity: 20,
          price: 5,
          description: "We are watching the Lakers win!",
          startDate: "2024-11-19 16:00:00",
          endDate: "2024-11-19 19:00:00",
        },
      ],
      { validate: true }
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Events";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        type: ['Online', 'In person']
      },
      {}
    );
  },
};
