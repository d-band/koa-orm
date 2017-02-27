'use strict';

const expect = require('chai').expect;
const orm = require('../lib/orm');
const config = require('./config');
const data = require('./data');

const databases = orm([config]);

describe('orm test', function() {
  this.timeout(0);

  const db = databases.orm_test;

  before(done => {
    // init db
    db.sync({ force: true })
      .then(() => db.Foo.bulkCreate(data.foos))
      .then(() => db.Bar.bulkCreate(data.bars))
      .then(() => done());
  });

  it('sql query', done => {
    const foos = db.sql
      .select()
      .field('name')
      .field('pass')
      .from('foo')
      .query();

    const bars = db.sql
      .select()
      .from('bar')
      .field('title')
      .field('content')
      .field('foo')
      .query();

    const foo = db.sql
      .select()
      .field('name')
      .field('pass')
      .from('foo')
      .where('name = ?', 'hello')
      .queryOne();

    const bar = db.sql
      .select()
      .from('bar')
      .field('title')
      .field('content')
      .field('foo')
      .where('title = ?', 'hello')
      .queryOne();

    Promise.all([foos, bars, foo, bar]).then(v => {
      expect(v[0]).to.deep.equal(data.foos);
      expect(v[1]).to.deep.equal(data.bars);
      expect(v[2]).to.deep.equal(data.foos[0]);
      expect(v[3]).to.deep.equal(data.bars[0]);
      done();
    });
  });

  it('raw sql query', done => {
    const foos = db.query('select name,pass from foo;');
    const bars = db.query('select title,content,foo from bar;');
    const foo = db.queryOne('select name,pass from foo where name=?;', ['hello']);
    const bar = db.queryOne('select title,content,foo from bar where title=?;', ['hello']);
    const meta = db.query('insert into foo (name, pass, createdAt, updatedAt) values (?, ?, ?, ?);', ['hello3', 'world3', new Date(), new Date()]);

    Promise.all([foos, bars, foo, bar, meta]).then(v => {
      expect(v[0]).to.deep.equal(data.foos);
      expect(v[1]).to.deep.equal(data.bars);
      expect(v[2]).to.deep.equal(data.foos[0]);
      expect(v[3]).to.deep.equal(data.bars[0]);
      expect(v[4]).to.have.property('insertId');
      done();
    });
  });

  it('insert with field type date', done => {
    db.sql
      .insert()
      .into('foo')
      .setFields({
        name: 'hello4',
        pass: 'world4',
        createdAt: new Date(),
        updatedAt: new Date()
      }).query().then(v => {
      expect(v).to.have.property('insertId');
      done();
    });
  });

});
