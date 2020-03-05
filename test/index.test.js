'use strict';

const expect = require('chai').expect;
const request = require('supertest');
const Koa = require('koa');

const data = require('./data');
const config = require('./config');
const ORM = require('../');

describe('koa-orm', function() {
  this.timeout(0);

  const orm = ORM([config]);

  before(() => {
    const db = orm.database();
    // init db
    return db.sync({ force: true })
      .then(() => db.Foo.bulkCreate(data.foos))
      .then(() => db.Bar.bulkCreate(data.bars));
  });

  it('duplicate name', done => {
    orm.register();
    orm.register(Object.assign({ name: 'test' }, config));
    expect(orm.database('test')).to.have.property('sequelize');
    expect(orm.database('orm_test')).to.have.property('sequelize');
    const fn = orm.register.bind(null, config);
    expect(fn).to.throw('Duplicate name: \'orm_test\'');
    done();
  });

  it('orm middleware test', done => {
    const app = new Koa();
    app.use(orm.middleware)
      .use((ctx) => {
        // SQL query
        const foos = ctx.orm().sql('foo')
          .select('name', 'pass');

        const bars = ctx.orm().sql('bar')
          .select('title', 'content');

        return Promise.all([foos, bars]).then(v => {
          ctx.body = { foos: v[0], bars: v[1] };
        });
      });

    request(app.listen()).get('/')
      .expect('Content-Type', /application\/json/)
      .expect(/foos/)
      .expect(/bars/)
      .expect(200, done);
  });

  it('orm config not Array & middleware regist once', done => {
    const o = ORM(config);
    const db = o.database('orm_test');
    const mw = o.middleware;
    const app = new Koa();
    app.use(mw)
      .use(mw)
      .use((ctx) => {
        // SQL query
        const foos = ctx.orm().sql('foo')
          .select('name', 'pass');

        const bars = db.sql('bar')
          .select('title', 'content');

        return Promise.all([foos, bars]).then(v => {
          ctx.body = { foos: v[0], bars: v[1] };
        });
      });

    request(app.listen()).get('/')
      .expect('Content-Type', /application\/json/)
      .expect(/foos/)
      .expect(/bars/)
      .expect(200, done);
  });
});
