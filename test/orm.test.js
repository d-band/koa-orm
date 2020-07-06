'use strict';

const expect = require('chai').expect;
const orm = require('../lib/orm');
const config = require('./config');
const data = require('./data');

const databases = orm([config]);

describe('orm test', function() {
  this.timeout(0);

  const db = databases.orm_test;

  before(() => {
    // init db
    return db.sync({ force: true })
      .then(() => db.Foo.bulkCreate(data.foos))
      .then(() => db.Bar.bulkCreate(data.bars));
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

  it('sum query', () => {
    const Bar = db.Bar;
    const num1 = Bar.sum('likes', {
      where: { title: 'nodata' }
    });
    const num2 = Bar.sum('likes');
    return Promise.all([num1, num2]).then(v => {
      // Bug: https://github.com/sequelize/sequelize/issues/6299
      expect(v[0]).to.be.NaN;
      expect(v[1]).to.equal(30);
    });
  });

  it('sql query', () => {
    const foos = db.sql
      .select('name', 'pass')
      .from('foo');

    const bars = db.sql
      .select('title', 'content', 'likes', 'foo')
      .from('bar');

    const foo = db.sql
      .select('name', 'pass')
      .from('foo')
      .where('name', 'hello')
      .first();

    const bar = db.sql
      .from('bar')
      .select('title', 'content', 'likes', 'foo')
      .where('title', 'hello')
      .first();

    return Promise.all([foos, bars, foo, bar]).then(v => {
      expect(v[0]).to.deep.equal(data.foos);
      expect(v[1]).to.deep.equal(data.bars);
      expect(v[2]).to.deep.equal(data.foos[0]);
      expect(v[3]).to.deep.equal(data.bars[0]);
    });
  });

  it('raw sql query', () => {
    const foos = db.query('select name, pass from foo;');
    const bars = db.query('select title, content, likes, foo from bar;');
    const foo = db.queryOne('select name,pass from foo where name=?;', ['hello']);
    const bar = db.queryOne('select title, content, likes, foo from bar where title=?;', ['hello']);

    return Promise.all([foos, bars, foo, bar]).then(v => {
      expect(v[0]).to.deep.equal(data.foos);
      expect(v[1]).to.deep.equal(data.bars);
      expect(v[2]).to.deep.equal(data.foos[0]);
      expect(v[3]).to.deep.equal(data.bars[0]);
    });
  });

  it('raw sql query insert meta', () => {
    const meta = db.query('insert into foo (name, pass, createdAt, updatedAt) values (?, ?, ?, ?);', ['hello3', 'world3', new Date(), new Date()]);

    return meta.then(v => {
      expect(v).to.deep.equal([3, 1]);
    });
  });

  it('insert with field type date', () => {
    return db.sql('foo')
      .insert({
        name: 'hello4',
        pass: 'world4',
        createdAt: new Date(),
        updatedAt: new Date()
      }).then(v => {
      expect(v).to.deep.equal([4, 1]);
    });
  });

  it('sequelize hooks', () => {
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
    return Foo.create({
      name: 'hooks',
      pass: 'hooks'
    }).then(foo => {
      return foo.destroy();
    }).then(() => {
      return Promise.all([bc, bd, ac, ad]).then(result => {
        expect(result[0]).to.equal('hooks');
        expect(result[1]).to.equal(5);
        expect(result[2]).to.equal(5);
        expect(result[3]).to.equal(5);
      });
    });
  });

});
