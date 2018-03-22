'use strict';

const chai           = require('chai');
const chaiAsPromised = require('chai-as-promised');
const Hapi           = require('hapi');
const path           = require('path');

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('bookshelf plugin', () => {

  it('should fail to load with bad knex options', () => {
    const server = new Hapi.Server();

    expect(server.register([
      {
        plugin: require('../lib/'),
        options: {
          knex: {
            client: 'fake_client'
          },
          models: 'asdf',
          base: function () {
            return 1;
          }
        }
      }
    ])).to.be.rejectedWith(Error);
  });

  it('should fail to load with bad models path', () => {
    const server = new Hapi.Server();

    expect(server.register([
      {
        plugin: require('../lib/'),
        options: {
          knex: {},
          models: 'asdf',
          base: function () {
            return 1;
          }
        }
      }
    ])).to.be.rejectedWith(Error);
  });

  it('should fail to load with bad schema', () => {
    const server = new Hapi.Server();

    expect(server.register([
      {
        plugin: require('../lib/'),
        options: {
          knex: {
            client: 'pg',
            connection: {
              host: '',
              user: '',
              password: '',
              database: ''
            }
          },
          plugins: 'asdf'
        }
      }
    ])).to.be.rejectedWith(Error);
  });

  it('should load a good configuration with plugin as string', () => {
    const server = new Hapi.Server();

    expect(server.register([
      {
        plugin: require('../lib/'),
        options: {
          knex: {
            client: 'sqlite3',
            useNullAsDefault: true,
            connection: {
              filename: './database.sqlite'
            }
          },
          plugins: ['registry'],
          models: path.join(`${__dirname}/models`),
          base: function (bookshelf) {
            return bookshelf.Model.extend({
              test: 'test'
            });
          }
        }
      }
    ])).to.be.fulfilled;

    expect(server.plugins.bookshelf.model('User')).to.be.a('function');
    expect(server.plugins.bookshelf.model('Role')).to.be.undefined;
    const User = server.plugins.bookshelf.model('User').forge({ id: 1 });
    expect(User.test).to.eql('test');
  });

  it('should load a good configuration with plugin as object', () => {
    const server = new Hapi.Server();

    expect(server.register([
      {
        plugin: require('../lib/'),
        options: {
          knex: {
            client: 'sqlite3',
            useNullAsDefault: true,
            connection: {
              filename: './database.sqlite'
            }
          },
          plugins: [{ name: 'registry' }],
          models: path.join(`${__dirname}/models`),
          base: function (bookshelf) {
            return bookshelf.Model.extend({
              test: 'test'
            });
          }
        }
      }
    ])).to.be.fulfilled;

    expect(server.plugins.bookshelf.model('User')).to.be.a('function');
    expect(server.plugins.bookshelf.model('Role')).to.be.undefined;
    const User = server.plugins.bookshelf.model('User').forge({ id: 1 });
    expect(User.test).to.eql('test');
  });

  it('should load a good configuration with relative path', () => {
    const server = new Hapi.Server();

    expect(server.register([
      {
        plugin: require('../lib/'),
        options: {
          knex: {
            client: 'sqlite3',
            useNullAsDefault: true,
            connection: {
              filename: './database.sqlite'
            }
          },
          plugins: ['registry'],
          models: 'test/models',
          base: function (bookshelf) {
            return bookshelf.Model.extend({
              test: 'test'
            });
          }
        }
      }
    ])).to.be.fulfilled;

    expect(server.plugins.bookshelf.model('User')).to.be.a('function');
    expect(server.plugins.bookshelf.model('Role')).to.be.undefined;
    const User = server.plugins.bookshelf.model('User').forge({ id: 1 });
    expect(User.test).to.eql('test');
  });

  it('should load a good configuration with glob', () => {
    const server = new Hapi.Server();

    expect(server.register([
      {
        plugin: require('../lib/'),
        options: {
          knex: {
            client: 'sqlite3',
            useNullAsDefault: true,
            connection: {
              filename: './database.sqlite'
            }
          },
          plugins: ['registry'],
          models: [
            path.join(`${__dirname}/models/*.js`),
            path.join(`${__dirname}/models/subfolder/*.js`)
          ],
          base: function (bookshelf) {
            return bookshelf.Model.extend({
              test: 'test'
            });
          }
        }
      }
    ])).to.be.fulfilled;

    expect(server.plugins.bookshelf.model('User')).to.be.a('function');
    expect(server.plugins.bookshelf.model('Role')).to.be.a('function');
    const User = server.plugins.bookshelf.model('User').forge({ id: 1 });
    expect(User.test).to.eql('test');
  });

  it('should load a good configuration with recursive glob as array', () => {
    const server = new Hapi.Server();

    expect(server.register([
      {
        plugin: require('../lib/'),
        options: {
          knex: {
            client: 'sqlite3',
            useNullAsDefault: true,
            connection: {
              filename: './database.sqlite'
            }
          },
          plugins: ['registry'],
          models: [path.join(`${__dirname}/models/**/*.js`)],
          base: function (bookshelf) {
            return bookshelf.Model.extend({
              test: 'test'
            });
          }
        }
      }
    ])).to.be.fulfilled;

    expect(server.plugins.bookshelf.model('User')).to.be.a('function');
    expect(server.plugins.bookshelf.model('Role')).to.be.a('function');
    const User = server.plugins.bookshelf.model('User').forge({ id: 1 });
    expect(User.test).to.eql('test');
  });

  it('should load a good configuration with recursive glob as string', () => {
    const server = new Hapi.Server();

    expect(server.register([
      {
        plugin: require('../lib/'),
        options: {
          knex: {
            client: 'sqlite3',
            useNullAsDefault: true,
            connection: {
              filename: './database.sqlite'
            }
          },
          plugins: ['registry'],
          models: path.join(`${__dirname}/models/**/*.js`),
          base: function (bookshelf) {
            return bookshelf.Model.extend({
              test: 'test'
            });
          }
        }
      }
    ])).to.be.fulfilled;

    expect(server.plugins.bookshelf.model('User')).to.be.a('function');
    expect(server.plugins.bookshelf.model('Role')).to.be.a('function');
    const User = server.plugins.bookshelf.model('User').forge({ id: 1 });
    expect(User.test).to.eql('test');
  });

  it('should load a good configuration with absolute path as string', () => {
    const server = new Hapi.Server();

    expect(server.register([
      {
        plugin: require('../lib/'),
        options: {
          knex: {
            client: 'sqlite3',
            useNullAsDefault: true,
            connection: {
              filename: './database.sqlite'
            }
          },
          plugins: ['registry'],
          models: path.join(`${__dirname}/models/user.js`),
          base: function (bookshelf) {
            return bookshelf.Model.extend({
              test: 'test'
            });
          }
        }
      }
    ])).that.be.fulfilled;

    expect(server.plugins.bookshelf.model('User')).to.be.a('function');
    const User = server.plugins.bookshelf.model('User').forge({ id: 1 });
    expect(User.test).to.eql('test');
  });

  it('should load a good configuration with absolute paths as array', () => {
    const server = new Hapi.Server();

    expect(server.register([
      {
        plugin: require('../lib/'),
        options: {
          knex: {
            client: 'sqlite3',
            useNullAsDefault: true,
            connection: {
              filename: './database.sqlite'
            }
          },
          plugins: ['registry'],
          models: [
            path.join(`${__dirname}/models/user.js`),
            path.join(`${__dirname}/models/subfolder/role.js`)
          ],
          base: function (bookshelf) {
            return bookshelf.Model.extend({
              test: 'test'
            });
          }
        }
      }
    ])).to.be.fulfilled;

    expect(server.plugins.bookshelf.model('User')).to.be.a('function');
    expect(server.plugins.bookshelf.model('Role')).to.be.a('function');
    const User = server.plugins.bookshelf.model('User').forge({ id: 1 });
    expect(User.test).to.eql('test');
  });

  it('should load combination of models', () => {
    const server = new Hapi.Server();
    const _baseOptions = {
      plugin: require('../lib/'),
      options: {
        knex: {
          client: 'sqlite3',
          useNullAsDefault: true,
          connection: {
            filename: './database.sqlite'
          }
        },
        plugins: ['registry'],
        base: function (bookshelf) {
          return bookshelf.Model.extend({
            test: 'test'
          });
        }
      }
    };

    _baseOptions.options.models = [
      path.join(`${__dirname}/models/user.js`),
      path.join(`${__dirname}/models/subfolder/**/*.js`)
    ];
    expect(server.register([_baseOptions])).to.be.fulfilled;

    expect(server.plugins.bookshelf.model('User')).to.be.a('function');
    expect(server.plugins.bookshelf.model('Role')).to.be.a('function');
    const User = server.plugins.bookshelf.model('User').forge({ id: 1 });
    expect(User.test).to.eql('test');
  });

  it('should load a good configuration without base', () => {
    const server = new Hapi.Server();

    expect(server.register([
      {
        plugin: require('../lib/'),
        options: {
          knex: {
            client: 'sqlite3',
            useNullAsDefault: true,
            connection: {
              filename: './database.sqlite'
            }
          },
          plugins: ['registry'],
          models: path.join(`${__dirname}/models`)
        }
      }
    ])).to.be.fulfilled;

    expect(server.plugins.bookshelf.model('User')).to.be.a('function');
  });

  it('should allow namespacing', () => {
    const server = new Hapi.Server();

    expect(server.register([
      {
        plugin: require('../lib/'),
        options: {
          knex: {
            client: 'sqlite3',
            useNullAsDefault: true,
            connection: {
              filename: './database.sqlite'
            }
          },
          plugins: ['registry'],
          models: path.join(`${__dirname}/models`),
          namespace: 'test'
        }
      }
    ])).to.be.fulfilled;

    expect(server.plugins.bookshelf.test.model('User')).to.be.a('function');
  });

  it('should load a good configuration with base object', () => {
    const server = new Hapi.Server();

    expect(server.register([
      {
        plugin: require('../lib/'),
        options: {
          knex: {
            client: 'sqlite3',
            useNullAsDefault: true,
            connection: {
              filename: './database.sqlite'
            }
          },
          plugins: ['registry'],
          models: path.join(`${__dirname}/models`),
          base: {
            model: function (bookshelf) {
              return bookshelf.Model.extend({
                test: 'test'
              });
            }
          }
        }
      }
    ])).to.be.fulfilled;

    expect(server.plugins.bookshelf.model('User')).to.be.a('function');
    const User = server.plugins.bookshelf.model('User').forge({ id: 1 });
    expect(User.test).to.eql('test');
  });

  it('should load a good configuration with base collection', () => {
    const server = new Hapi.Server();

    expect(server.register([
      {
        plugin: require('../lib/'),
        options: {
          knex: {
            client: 'sqlite3',
            useNullAsDefault: true,
            connection: {
              filename: './database.sqlite'
            }
          },
          plugins: ['registry'],
          models: path.join(`${__dirname}/models`),
          collections: path.join(`${__dirname}/collections`),
          base: {
            collection: function (bookshelf) {
              return bookshelf.Collection.extend({
                test: 'test'
              });
            }
          }
        }
      }
    ])).to.be.fulfilled;

    expect(server.plugins.bookshelf.model('User')).to.be.a('function');
    expect(server.plugins.bookshelf.collection('Users')).to.be.a('function');
    const User = server.plugins.bookshelf.model('User').forge({ id: 1 });
    const Users = server.plugins.bookshelf.collection('Users').forge([User]);
    expect(Users.test).to.eql('test');
  });

});
