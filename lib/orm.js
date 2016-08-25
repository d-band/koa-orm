'use strict';

const Sequelize = require('sequelize');
const sql = require('./sql');
const models = require('./models');

module.exports = (db_configs) => {
  const databases = {};

  for (let cfg of db_configs) {
    const db = cfg.db || cfg.database;
    const name = cfg.name || db;
    const opts = cfg.options || cfg;
    const sequelize = new Sequelize(db, cfg.username, cfg.password, opts);

    // object for exports
    const database = {
      sequelize: sequelize,
      sync: sequelize.sync.bind(sequelize)
    };

    // squel & functions: query, queryOne
    Object.assign(database, sql(sequelize, opts.dialect));

    // init models
    cfg.modelPath && Object.assign(database, models(sequelize, cfg.modelPath));

    databases[name] = database;
  }

  return databases;
};
