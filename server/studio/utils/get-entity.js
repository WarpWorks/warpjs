const Promise = require('bluebird');

const getCoreDomain = require('./get-core-domain');

module.exports = (persistence, type) => Promise.resolve()
    .then(() => getCoreDomain())
    .then((domainModel) => domainModel.getEntityByName(type))
;
