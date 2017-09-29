const _ = require('lodash');

const constants = require('./constants');

const _cache = _.values(constants);

module.exports = (action) => (_cache.indexOf(action) !== -1);
