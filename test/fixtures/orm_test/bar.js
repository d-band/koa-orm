'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function(sequelize, types) {
  var Bar = sequelize.define('Bar', {
    title: {
      type: types.STRING(50),
    },
    content: {
      type: types.STRING(50)
    },
    likes: {
      type: types.INTEGER
    }
  }, {
    tableName: 'bar'
  });
  Bar.associate = (models) => {
    Bar.belongsTo(models.Foo, {
      foreignKey: 'foo'
    });
  };
  return Bar;
};
