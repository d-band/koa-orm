# koa-orm

[![NPM version](https://img.shields.io/npm/v/koa-orm.svg)](https://www.npmjs.com/package/koa-orm)
[![NPM downloads](https://img.shields.io/npm/dm/koa-orm.svg)](https://www.npmjs.com/package/koa-orm)
[![Dependency Status](https://david-dm.org/d-band/koa-orm.svg)](https://david-dm.org/d-band/koa-orm)
[![Build Status](https://travis-ci.org/d-band/koa-orm.svg?branch=master)](https://travis-ci.org/d-band/koa-orm)
[![Coverage Status](https://coveralls.io/repos/github/d-band/koa-orm/badge.svg?branch=master)](https://coveralls.io/github/d-band/koa-orm?branch=master)

koa orm using [sequelize](https://github.com/sequelize/sequelize) & [squel](https://github.com/hiddentao/squel).

## Installation

```
$ npm install koa-orm
```

## Example

```js
var join = require('path').join;
var config = {
  modelPath: join(__dirname, 'models'),
  db: 'orm_test',
  username: 'root',
  password: 'pass',
  dialect: 'mysql',
  host: '127.0.0.1',
  port: 3306,
  pool: {
    maxConnections: 10,
    minConnections: 0,
    maxIdleTime: 30000
  }
};

var orm = require('koa-orm')(config);

app.use(orm.middleware);

app.use(function* (next) {
  var raws = yield this.orm().sql.select().from('table').query();
  // var raws = yield this.orm('orm_test').sql.select().from('table').query();
  this.body = raws;
});
```

More examples: [test](./test/index.test.js)

## API

#### `orm(configs)`

* `configs`: Multi database config array.

## License

MIT