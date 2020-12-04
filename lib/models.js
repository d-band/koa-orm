'use strict';

const fs = require('fs');
const join = require('path').join;
const Sequelize = require('sequelize');

module.exports = (sequelize, modelPath) => {
  const models = {};

  // Bootstrap models
  fs.readdirSync(modelPath)
    .forEach(function(file) {
      if (/\.js$/.test(file)) {
        let defineCall = require(join(modelPath, file));
        if (typeof defineCall === 'object') {
          // ES6 module compatibility
          defineCall = defineCall.default;
        }
        const model = defineCall(sequelize, Sequelize);
        models[model.name] = model;
      }
    });

  Object.keys(models).forEach(function(modelName) {
    if (models[modelName].associate) {
      models[modelName].associate(models);
    }
  });

  return models;
};
