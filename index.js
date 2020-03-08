'use strict';

const orm = require('./lib/orm');

module.exports = (initialConfigs) => {
  const databases = {};

  let first;
  function register(configs) {
    if (!configs) return;
    // Object to Array
    if (!Array.isArray(configs)) {
      configs = [configs];
    }
    configs.forEach((c, i) => {
      const name = c.name || c.db || c.database;
      if (databases[name]) {
        throw new Error(`Duplicate name: '${name}'`);
      }
      if (!first && i === 0) {
        first = name;
      }
    });
    Object.assign(databases, orm(configs));
  }

  function database(name) {
    // Default is first database
    name = name || first;
    return databases[name];
  }

  function middleware(ctx, next) {
    if (ctx.orm) return next();
    ctx.orm = database;
    return next();
  }

  register(initialConfigs);

  return {
    register,
    database,
    middleware
  };
};

module.exports.Sequelize = require('sequelize');
