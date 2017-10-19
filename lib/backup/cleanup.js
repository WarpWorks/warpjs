const debug = require('debug')('W2:backup:cleanup');
const Promise = require('bluebird');
const shelljs = require('shelljs');

module.exports = (folder) => Promise.resolve()
    .then(() => debug(`Need to clean up folder '${folder}'.`))
    .then(() => shelljs.rm('-rf', folder))
    .then(() => debug(`... clean up done.`))
;
