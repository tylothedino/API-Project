"use strict";

const { GroupImage } = require("../models");
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await GroupImage.bulkCreate(
      [
        {
          groupId: 1,
          url: 'https://picsum.photos/200/300',
          preview: true
        },
        {
          groupId: 2,
          url: 'https://picsum.photos/200/300',
          preview: false
        },
        {
          groupId: 3,
          url: 'https://picsum.photos/200/300',
          preview: true
        },
        {
          groupId: 3,
          url: 'https://picsum.photos/200/300',
          preview: true

        },
      ],
      { validate: true }
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "GroupImages";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        groupId: [1, 2, 3]
      },
      {}
    );
  },
};
