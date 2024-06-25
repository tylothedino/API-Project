"use strict";

const { EventImage } = require("../models");
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await EventImage.bulkCreate(
      [
        {
          eventId: 1,
          url: 'https://picsum.photos/200/300',
          preview: true
        },
        {
          eventId: 2,
          url: 'https://picsum.photos/200/300',
          preview: false
        },
        {
          eventId: 3,
          url: 'https://picsum.photos/200/300',
          preview: true
        },
        {
          eventId: 3,
          url: 'https://picsum.photos/200/300',
          preview: true

        },
      ],
      { validate: true }
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "EventImages";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {

      },
      {}
    );
  },
};
