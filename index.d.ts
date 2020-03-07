import Koa = require('koa');
import sk2 = require('sk2');
import Sequelize = require('sequelize');

declare namespace orm {
  export { Sequelize };
  export interface Config extends Sequelize.Options {
    name?: string;
    db?: string;
    modelPath?: string;
    options?: Sequelize.Options;
    knexConfig: sk2.Knex.Config;
  }

  export interface Database {
    Op: typeof Sequelize.Op;
    Sequelize: typeof Sequelize;
    sequelize: Sequelize.Sequelize;
    sync: (options?: Sequelize.SyncOptions | undefined) => any;
    sql: sk2.Knex<any, unknown[]>;
    query: (text: string, values: any[], options: Sequelize.QueryOptions) => any;
    queryOne: (text: string, values: any[], options: object) => any;
    [key: string]: any;
  }

  export interface ORM {
    register: (configs: Config | Config[]) => void;
    database: (name?: string | undefined) => Database;
    middleware: Koa.Middleware;
  }
}

declare function orm(configs: orm.Config | orm.Config[]): orm.ORM;

declare module "koa" {
  interface Context {
    orm: (name?: string) => orm.Database;
  }
}

export = orm;
