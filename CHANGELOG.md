#### 2.0.1 (2018-3-22)

##### Chores

* **dependencies:** Remove all gulp related packages and replace it with npm scripts
- Update code to support es6 features

##### Chores

* **plugins:** add accepting configurable plugins ([96ad4494](https://github.com/Do-IT-Programming-Solutions-LP/hapi-bookshelf-models2/commit/96ad449482ab67f4c765f9090c8b10b801103d6d))
* **errors:** report original error if models/collections fail ([222a658e](https://github.com/Do-IT-Programming-Solutions-LP/hapi-bookshelf-models2/commit/222a658e08a2c59085d9f60eee98b1cd1fd34bda))
* **lint:** replace jscs and jshint with eslint ([52357827](https://github.com/Do-IT-Programming-Solutions-LP/hapi-bookshelf-models2/commit/523578276a8a24431fa269ce9113594d5ace48f1))

##### Documentation Changes

* **contributing:** add CONTRIBUTING.md ([b8c0289a](https://github.com/Do-IT-Programming-Solutions-LP/hapi-bookshelf-models2/commit/b8c0289a1c2f1fd1e589b3201b6dc3092381e8be))

## 2.0.0 (2016-6-4)

##### Chores

* **dependencies:** make bookshelf and knex peer dependencies ([e39441c9](https://github.com/lob/hapi-bookshelf-models/commit/e39441c9a4ca394982158a34d8f65f671a2b18ab))

### 1.8.0 (2016-5-17)

##### New Features

* **collections:** add support for bookshelf collections ([4cae0206](https://github.com/lob/hapi-bookshelf-models/commit/4cae0206a35679f8b176d6d71f958b5949ab6611))

#### 1.7.1 (2016-2-11)

##### Bug Fixes

* **paths:** fixed error thrown by a configuration with a relative path to models ([efadcdd4](https://github.com/lob/hapi-bookshelf-models/commit/efadcdd4b6f36fa197b27577eeeb205cef12c710))

### 1.7.0 (2016-2-2)

##### New Features

* **paths:** added glob to support wildcard model folder structure ([68fc0f5a](https://github.com/lob/hapi-bookshelf-models/commit/68fc0f5a8e888204145d9ba4f1764b5efb7bdb5b))

##### Chores

* **release:** add release scripts with changelog generation ([63bbf46f](https://github.com/lob/hapi-bookshelf-models/commit/63bbf46f))

## 1.6.0 (2015-12-23)

- Update bookshelf to 0.9.1

## 1.5.0 (2015-09-29)

- Allow Hapi 9.x and 10.x

## 1.4.0 (2015-09-10)

- Ignore hidden files in models directory

## 1.3.0 (2015-03-01)

- Pass `bookshelf` instance to model register

## 1.2.0 (2015-01-29)

- Added ability to namespace models to support multiple connections

## 1.1.0 (2015-01-21)

- Made `base` optional in register
