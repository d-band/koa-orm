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

  it('duplicate name', done => {
    expect(db).to.have.property('Op');
    expect(db).to.have.property('Sequelize');
    expect(db).to.have.property('sequelize');
    expect(db).to.have.property('sync');
    expect(db).to.have.property('sql');
    expect(db).to.have.property('query');
    expect(db).to.have.property('queryOne');
    expect(db).to.have.property('Foo');
    expect(db).to.have.property('Bar');
    done();
  });

  it('duplicate name', done => {
    const fn = orm.bind(null, [config, config]);
    expect(fn).to.throw('Duplicate name: \'orm_test\'');
    done();
  });

  it('sum query', done => {
    const Bar = db.Bar;
    const num1 = Bar.sum('likes', {
      where: { title: 'nodata' }
    });
    const num2 = Bar.sum('likes');
    Promise.all([num1, num2]).then(v => {
      // Bug: https://github.com/sequelize/sequelize/issues/6299
      expect(v[0]).to.be.NaN;
      expect(v[1]).to.equal(30);
      done();
    });
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
      .field('likes')
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
      .field('likes')
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
    const foos = db.query('select name, pass from foo;');
    const bars = db.query('select title, content, likes, foo from bar;');
    const foo = db.queryOne('select name,pass from foo where name=?;', ['hello']);
    const bar = db.queryOne('select title, content, likes, foo from bar where title=?;', ['hello']);
    const meta = db.query('insert into foo (name, pass, createdAt, updatedAt) values (?, ?, ?, ?);', ['hello3', 'world3', new Date(), new Date()]);

    Promise.all([foos, bars, foo, bar, meta]).then(v => {
      expect(v[0]).to.deep.equal(data.foos);
      expect(v[1]).to.deep.equal(data.bars);
      expect(v[2]).to.deep.equal(data.foos[0]);
      expect(v[3]).to.deep.equal(data.bars[0]);
      expect(v[4]).to.deep.equal([3, 1]);
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
      expect(v).to.deep.equal([4, 1]);
      done();
    });
  });

  it('sequelize hooks', done => {
    const Foo = db.Foo;
    const bc = new Promise((resolve) => {
      Foo.beforeCreate(foo => resolve(foo.name));
    });
    const bd = new Promise((resolve) => {
      Foo.beforeDestroy(foo => resolve(foo.id));
    });
    const ac = new Promise((resolve) => {
      Foo.afterCreate(foo => resolve(foo.id));
    });
    const ad = new Promise((resolve) => {
      Foo.afterDestroy(foo => resolve(foo.id));
    });
    Foo.create({
      name: 'hooks',
      pass: 'hooks'
    }).then(foo => {
      return foo.destroy();
    }).then(() => {
      Promise.all([bc, bd, ac, ad]).then(result => {
        expect(result[0]).to.equal('hooks');
        expect(result[1]).to.equal(5);
        expect(result[2]).to.equal(5);
        expect(result[3]).to.equal(5);
        done();
      });
    });
  });

});
