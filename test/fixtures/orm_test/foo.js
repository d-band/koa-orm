'use strict';

module.exports = function(sequelize, types) {
  return sequelize.define('Foo', {
    name: {
      type: types.STRING(50),
    },
    pass: {
      type: types.STRING(50)
    }
  }, {
    tableName: 'foo'
  });
};