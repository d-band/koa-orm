'use strict';

const orm = require('./lib/orm');

module.exports = (db_configs) => {
  // Object to Array
  if (!(db_configs instanceof Array)) {
    db_configs = [db_configs];
  }

  const databases = orm(db_configs);

  function db(name) {
    // Default is first database
    name = name || db_configs[0].db || db_configs[0].database;
    return databases[name];
  }

  function* mw(next) {
    if (this.orm) return yield next;
    Object.assign(this, {
      orm: db
    });
    yield next;
  }

  return {
    database: db,
    middleware: mw
  };
};
