'use strict';

const Sequelize = require('sequelize');
const sql = require('./sql');
const models = require('./models');

module.exports = (db_configs) => {
  const databases = {};

  for (let cfg of db_configs) {
    let db = cfg.db || cfg.database;
    let opts = cfg.options || cfg;
    let sequelize = new Sequelize(db, cfg.username, cfg.password, opts);

    // object for exports
    const database = {
      sequelize: sequelize
    };

    // squel & functions: query, queryOne
    Object.assign(database, sql(sequelize, opts.dialect));

    // init models
    cfg.modelPath && Object.assign(database, models(sequelize, cfg.modelPath));

    databases[db] = database;
  }

  return databases;
};
