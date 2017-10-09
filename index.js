'use strict';

const orm = require('./lib/orm');

module.exports = (configs) => {
  // Object to Array
  if (!(configs instanceof Array)) {
    configs = [configs];
  }

  const databases = orm(configs);

  function db(name) {
    const first = configs[0];
    // Default is first database
    name = name || first.name || first.db || first.database;
    return databases[name];
  }

  function mw(ctx, next) {
    if (ctx.orm) return next();
    ctx.orm = db;
    return next();
  }

  return {
    database: db,
    middleware: mw
  };
};
