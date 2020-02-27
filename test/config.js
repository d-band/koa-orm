'use strict';

const join = require('path').join;
const env = process.env;

module.exports = {
  modelPath: join(__dirname, 'fixtures/orm_test/'),
  database: env.MYSQL_DB || 'orm_test',
  username: env.MYSQL_USER || 'root',
  password: env.MYSQL_PASS || null,
  dialect: 'mysql',
  host: '127.0.0.1',
  port: 3306,
  pool: {
    max: 10,
    min: 0,
    idle: 30000
  },
  logging: false
};
