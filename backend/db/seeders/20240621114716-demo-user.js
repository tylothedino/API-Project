"use strict";

const { User } = require("../models");
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await User.bulkCreate(
      [
        {
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@example.com",
          username: "User1",
          hashedPassword: bcrypt.hashSync("password1"),
        },
        {
          firstName: "Jane",
          lastName: "Doe",
          email: "jane.doe@example.com",
          username: "User2",
          hashedPassword: bcrypt.hashSync("password2"),
        },
        {
          firstName: "Fred",
          lastName: "Johnson",
          email: "fred.johnson@example.com",
          username: "User3",
          hashedPassword: bcrypt.hashSync("password3"),
        }
      ],
      { validate: true }
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Users";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        username: {
          [Op.in]: [
            "User1",
            "User2",
            "User3"
          ],
        },
      },
      {}
    );
  },
};
