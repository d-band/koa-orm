'use strict';

const Sequelize = require('sequelize');
const sql = require('./sql');
const models = require('./models');

module.exports = (configs) => {
  const databases = {};

  configs.forEach(config => {
    const db = config.db || config.database;
    const name = config.name || db;
    if (databases[name]) {
      throw new Error(`Duplicate name: '${name}'`);
    }
    const options = config.options || config;
    const Op = Sequelize.Op;

    options.database = db;
    options.operatorsAliases = {
      $eq: Op.eq,
      $ne: Op.ne,
      $gte: Op.gte,
      $gt: Op.gt,
      $lte: Op.lte,
      $lt: Op.lt,
      $not: Op.not,
      $in: Op.in,
      $notIn: Op.notIn,
      $is: Op.is,
      $like: Op.like,
      $notLike: Op.notLike,
      $iLike: Op.iLike,
      $notILike: Op.notILike,
      $regexp: Op.regexp,
      $notRegexp: Op.notRegexp,
      $iRegexp: Op.iRegexp,
      $notIRegexp: Op.notIRegexp,
      $between: Op.between,
      $notBetween: Op.notBetween,
      $overlap: Op.overlap,
      $contains: Op.contains,
      $contained: Op.contained,
      $adjacent: Op.adjacent,
      $strictLeft: Op.strictLeft,
      $strictRight: Op.strictRight,
      $noExtendRight: Op.noExtendRight,
      $noExtendLeft: Op.noExtendLeft,
      $and: Op.and,
      $or: Op.or,
      $any: Op.any,
      $all: Op.all,
      $values: Op.values,
      $col: Op.col
    };
    const sequelize = new Sequelize(options);

    // object for exports
    const database = {
      Op: Sequelize.Op,
      Sequelize: Sequelize,
      sequelize: sequelize,
      sync: sequelize.sync.bind(sequelize)
    };

    // sk2 & functions: query, queryOne
    Object.assign(database, sql(sequelize, config.knexConfig));

    // init models
    config.modelPath && Object.assign(database, models(sequelize, config.modelPath));

    databases[name] = database;
  });

  return databases;
};
