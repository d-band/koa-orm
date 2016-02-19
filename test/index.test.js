'use strict';

// const expect = require('chai').expect;
const request = require('supertest');
const koa = require('koa');

const data = require('./data');
const config = require('./config');
const orm = require('../');

describe('koa-orm', function() {
  const _orm = orm([config]);

  before(function*() {
    let db = _orm.database();
    // init db
    yield db.sequelize.sync({
      force: true
    });
    // insert data
    yield db.Foo.bulkCreate(data.foos);
    yield db.Bar.bulkCreate(data.bars);
  });

  it('orm middleware test', function(done) {
    var app = koa()
      .use(_orm.middleware)
      .use(function*() {
        // SQL query
        let foos = yield this.orm().sql
          .select()
          .field("name")
          .field("pass")
          .from('foo')
          .query();

        let bars = yield this.orm().sql
          .select()
          .from('bar')
          .field("title")
          .field("content")
          .query();

        this.body = {
          foos: foos,
          bars: bars
        };
      });

    request(app.listen()).get('/')
      .expect('Content-Type', /application\/json/)
      .expect(/foos/)
      .expect(/bars/)
      .expect(200, done);
  });

  it('orm config not Array & middleware regist once', function(done) {
    var o = orm(config);
    var db = o.database('orm_test');
    var mw = o.middleware;
    var app = koa()
      .use(mw)
      .use(mw)
      .use(function*() {
        // SQL query
        let foos = yield this.orm().sql
          .select()
          .field("name")
          .field("pass")
          .from('foo')
          .query();

        let bars = yield db.sql
          .select()
          .from('bar')
          .field("title")
          .field("content")
          .query();

        this.body = {
          foos: foos,
          bars: bars
        };
      });

    request(app.listen()).get('/')
      .expect('Content-Type', /application\/json/)
      .expect(/foos/)
      .expect(/bars/)
      .expect(200, done);
  });
});