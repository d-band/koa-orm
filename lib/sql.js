'use strict';
const squel = require('squel');

module.exports = (sequelize, dialect) => {
  function query(text, values, options) {
    options = Object.assign({
      replacements: values
    }, options);

    if (/select /i.test(text) && !options.type) {
      options.type = sequelize.QueryTypes.SELECT;
    }

    return sequelize.query(text, options);
  }

  function queryOne(text, values, options) {
    return query(text, values, options).then(rows => {
      return rows && rows[0];
    });
  }

  // squel init & add functions: query, queryOne
  const DIALECTS = {
    mysql: 'mysql',
    postgres: 'postgres',
    mssql: 'mssql'
  };

  const sql = squel.useFlavour(DIALECTS[dialect]);

  sql.registerValueHandler(Date, function(date) {
    return date;
  });

  sql.cls.QueryBuilder.prototype.query = function(t) {
    const param = this.toParam();
    return query(param.text, param.values, t);
  };

  sql.cls.QueryBuilder.prototype.queryOne = function(t) {
    const param = this.toParam();
    return queryOne(param.text, param.values, t);
  };

  return {
    sql: sql,
    query: query,
    queryOne: queryOne
  };
};
