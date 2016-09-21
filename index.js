'use strict';

const orm = require('./lib/orm');

module.exports = (db_configs) => {
  // Object to Array
  if (!(db_configs instanceof Array)) {
    db_configs = [db_configs];
  }

  const databases = orm(db_configs);

  function db(name) {
    const first = db_configs[0];
    // Default is first database
    name = name || first.name || first.db || first.database;
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
