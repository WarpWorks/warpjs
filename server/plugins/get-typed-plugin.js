const cache = require('./cache');

module.exports = (type) => cache.filter((plugin) => plugin.type === type).pop();
