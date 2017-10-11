const debug = require('debug')('W2:backup:cleanup');
const Promise = require('bluebird');

module.exports = (folder) => Promise.resolve()
    .then(() => debug(`Need to clean up folder '${folder}'.`))
;
