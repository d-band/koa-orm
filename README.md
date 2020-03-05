# koa-orm

[![NPM version](https://img.shields.io/npm/v/koa-orm.svg)](https://www.npmjs.com/package/koa-orm)
[![NPM downloads](https://img.shields.io/npm/dm/koa-orm.svg)](https://www.npmjs.com/package/koa-orm)
[![Dependency Status](https://david-dm.org/d-band/koa-orm.svg)](https://david-dm.org/d-band/koa-orm)
[![Build Status](https://travis-ci.org/d-band/koa-orm.svg?branch=master)](https://travis-ci.org/d-band/koa-orm)
[![Coverage Status](https://coveralls.io/repos/github/d-band/koa-orm/badge.svg?branch=master)](https://coveralls.io/github/d-band/koa-orm?branch=master)
[![Greenkeeper badge](https://badges.greenkeeper.io/d-band/koa-orm.svg)](https://greenkeeper.io/)

> `koa-orm` using [sequelize](https://github.com/sequelize/sequelize) & [sk2](https://github.com/d-band/sk2).

## Installation

```bash
npm install koa-orm
```

## Example

Single database

```js
const join = require('path').join;
const config = {
  name: 'test',
  modelPath: join(__dirname, 'models'),
  database: 'orm_test',
  username: 'root',
  password: 'pass',
  dialect: 'mysql',
  host: '127.0.0.1',
  port: 3306,
  pool: {
    max: 10,
    min: 0,
    idle: 30000
  }
};

const orm = require('koa-orm')(config);

app.use(orm.middleware);

app.use(async function (ctx) {
  const raws = await ctx.orm().sql.select().from('table');
  // const raws = await ctx.orm('test').sql('table').select();
  ctx.body = raws;
});
```

Multiple database

```js
const join = require('path').join;
const configs = [{
  name: 'user',
  database: 'db_user',
  username: 'root',
  password: 'pass',
  dialect: 'mysql',
  host: '127.0.0.1',
  port: 3306,
  modelPath: join(__dirname, 'models/user')
}, {
  name: 'product',
  database: 'db_product',
  username: 'root',
  password: 'pass',
  dialect: 'mysql',
  host: '127.0.0.1',
  port: 3306,
  modelPath: join(__dirname, 'models/product')
}];

const orm = require('koa-orm')(configs);

app.use(orm.middleware);

app.use(async function (ctx) {
  const { User } = ctx.orm('user');
  const { Product } = ctx.orm('product');
  const { userId } = ctx.params;
  
  const user = await User.findByPk(userId);
  const products = await Product.findAll({
    where: { userId }
  });
  ctx.body = { user, products };
});
```

## API

#### `orm(configs)`

* `configs`: Multi database config array.

## Koa 1 Support

To use `koa-orm` with koa@1, please use [koa-orm 1.x](https://github.com/d-band/koa-orm/tree/v1.x).

```bash
npm install koa-orm@1 --save
```

## License

MIT