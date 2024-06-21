'use strict';

//FOR RENDER: It only allows for a single db. We are using a schema to create sub dbs
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}


module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'firstName', { type: Sequelize.STRING }, options);
    await queryInterface.addColumn('Users', 'lastName', { type: Sequelize.STRING }, options);
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Users";
    return queryInterface.removeColumn(options);


  }
};
