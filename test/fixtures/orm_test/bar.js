'use strict';

module.exports = function(sequelize, types) {
  return sequelize.define('Bar', {
    title: {
      type: types.STRING(50),
    },
    content: {
      type: types.STRING(50)
    }
  }, {
    tableName: 'bar'
  });
};