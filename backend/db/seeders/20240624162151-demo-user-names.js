'use strict';

const { User } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await User.bulkCreate([
      {
        email: 'tylo3@user.io',
        username: 'Demo-fake-1',
        hashedPassword: bcrypt.hashSync('password'),
        firstName: "John",
        lastName: "Legend"
      },
      {
        email: 'tylo1@user.io',
        username: 'Demo-fake-2',
        hashedPassword: bcrypt.hashSync('password2'),
        firstName: "Gabriel",
        lastName: "Michael"
      },
      {
        email: 'tylo2@user.io',
        username: 'Demo-fake-3',
        hashedPassword: bcrypt.hashSync('password3'),
        firstName: "Tyler",
        lastName: "Swarez"
      }
    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['tylo2', 'tylo1', 'tylo3'] }
    }, {});
  }
};
