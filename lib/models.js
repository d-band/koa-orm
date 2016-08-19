'use strict';

const fs = require('fs');
const join = require('path').join;

module.exports = (sequelize, modelPath) => {
  const models = {};

  // Bootstrap models
  fs.readdirSync(modelPath)
    .forEach(function(file) {
      if (/\.js$/.test(file)) {
        let model = sequelize.import(join(modelPath, file));
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
