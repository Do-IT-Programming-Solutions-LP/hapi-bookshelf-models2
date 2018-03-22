'use strict';

const fs   = require('fs');
const Joi  = require('joi');
const glob = require('glob');
const path = require('path');

const register = async (server, options) => {
  let bookshelf = null;

  const schema = {
    knex: Joi.object().required(),
    plugins: Joi.array().items([Joi.string(), Joi.object({
      name: Joi.string().required(),
      options: Joi.object().optional()
    })]).default([]),
    models: Joi.array().items(Joi.string()).single().default([]),
    collections: Joi.array().items(Joi.string()).single().default([]),
    base: Joi.alternatives().try(Joi.func(), Joi.object({
      model: Joi.func().optional(),
      collection: Joi.func().optional()
    })).optional(),
    namespace: Joi.string().optional()
  };

  const result = Joi.validate(options, schema);
  if (result.error) {
    throw new Error(result.error);
  }
  options = result.value;

  const knex = require('knex')(options.knex);
  bookshelf = require('bookshelf');
  bookshelf = bookshelf(knex);

  options.plugins.map((plugin) => {
    if (typeof plugin === 'string') {
      bookshelf.plugin(plugin);
    } else {
      bookshelf.plugin(plugin.name, plugin.options);
    }
  });

  let baseModel;
  let baseCollection;
  if (options.base) {
    if (typeof options.base === 'function') {
      baseModel = options.base(bookshelf);
    } else {
      if (options.base.model) {
        baseModel = options.base.model(bookshelf);
      }
      if (options.base.collection) {
        baseCollection = options.base.collection(bookshelf);
      }
    }
  }

  if (!baseModel) {
    baseModel = bookshelf.Model.extend({});
  }
  if (!baseCollection) {
    baseCollection = bookshelf.Collection.extend({});
  }

  function load (type, globPaths) {
    const base = type === 'model' ? baseModel : baseCollection;
    const modelObjects = globPaths.reduce((mo, filename) => {
      if (!glob.hasMagic(filename)) {
        filename = path.resolve(filename);
        const stats = fs.lstatSync(filename);
        if (stats.isDirectory()) {
          filename = path.join(filename, '*.js');
        }
      }
      return mo.concat(glob.sync(filename));
    }, []);

    modelObjects.forEach((model) => {
      const modelDir = path.dirname(model);
      const fileName = path.basename(model).replace(path.extname(model), '');
      const modelPath = path.resolve(path.join(modelDir, fileName));
      const modelName = fileName[0].toUpperCase() + fileName.substr(1);
      const modelDef = require(modelPath)(base, bookshelf);
      bookshelf[type](modelName, modelDef);
    });
  }

  load('model', options.models);
  load('collection', options.collections);

  if (options.namespace) {
    server.expose(options.namespace, bookshelf);
  } else {
    server.expose(bookshelf);
  }
};

module.exports = {
  register,
  name: 'bookshelf',
  version: '3.0.0',
  multiple: true
};
