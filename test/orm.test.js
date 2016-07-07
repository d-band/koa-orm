'use strict';

const expect = require('chai').expect;
const orm = require('../lib/orm');
const config = require('./config');
const data = require('./data');

const databases = orm([config]);

describe('orm test', function() {
  this.timeout(0);
  
  const db = databases.orm_test;

  before(function*() {
    // init db
    yield db.sync({
      force: true
    });
    // insert data
    yield db.Foo.bulkCreate(data.foos);
    yield db.Bar.bulkCreate(data.bars);
  });

  it('sql query', function*() {
    let foos = yield db.sql
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

    let foo = yield db.sql
      .select()
      .field("name")
      .field("pass")
      .from('foo')
      .where('name = ?', 'hello')
      .queryOne();

    let bar = yield db.sql
      .select()
      .from('bar')
      .field("title")
      .field("content")
      .where('title = ?', 'hello')
      .queryOne();

    expect(foos).to.deep.equal(data.foos);
    expect(bars).to.deep.equal(data.bars);
    expect(foo).to.deep.equal(data.foos[0]);
    expect(bar).to.deep.equal(data.bars[0]);
  });

  it('raw sql query', function*() {
    let foos = yield db.query('select name,pass from foo;');
    let bars = yield db.query('select title,content from bar;');
    let foo = yield db.queryOne('select name,pass from foo where name=?;', ['hello']);
    let bar = yield db.queryOne('select title,content from bar where title=?;', ['hello']);
    let meta = yield db.query('insert into foo (name, pass, createdAt, updatedAt) values (?, ?, ?, ?);', ['hello3', 'world3', new Date(), new Date()]);

    expect(foos).to.deep.equal(data.foos);
    expect(bars).to.deep.equal(data.bars);
    expect(foo).to.deep.equal(data.foos[0]);
    expect(bar).to.deep.equal(data.bars[0]);
    expect(meta).to.have.property('insertId');
  });

  it('insert with field type date', function*() {
    let meta = yield db.sql
      .insert()
      .into('foo')
      .setFields({
        name: 'hello4',
        pass: 'world4',
        createdAt: new Date(),
        updatedAt: new Date()
      }).query();
      
    expect(meta).to.have.property('insertId');
  });

});