'use strict';
const squel = require('squel');

module.exports = (sequelize, dialect) => {
  function* query(text, values, transaction) {
    let options = {
      replacements: values
    };

    transaction && Object.assign(options, {
      transaction: transaction
    });

    let data = yield sequelize.query(text, options);
    if (/select /i.test(text)) {
      return data[0];
    }
    return data[1];
  }

  function* queryOne(text, values, t) {
    let rows = yield query(text, values, t);
    return rows && rows[0];
  }

  // squel init & add functions: query, queryOne
  const DIALECTS = {
    mysql: 'mysql',
    postgres: 'postgres',
    mssql: 'mssql'
  };
  
  let sql = squel.useFlavour(DIALECTS[dialect]);

  sql.registerValueHandler(Date, function(date) {
    return date;
  });

  sql.cls.QueryBuilder.prototype.query = function*(t) {
    let param = this.toParam();
    return yield query(param.text, param.values, t);
  };

  sql.cls.QueryBuilder.prototype.queryOne = function*(t) {
    let param = this.toParam();
    return yield queryOne(param.text, param.values, t);
  };

  return {
    sql: sql,
    query: query,
    queryOne: queryOne
  };
};
