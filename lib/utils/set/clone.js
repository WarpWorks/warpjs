const cloneDeep = require('lodash/cloneDeep');

module.exports = (set) => new Set(cloneDeep([ ...set ]));
