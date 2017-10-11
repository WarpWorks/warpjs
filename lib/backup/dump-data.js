const debug = require('debug')('W2:backup:dumpData');
const Promise = require('bluebird');

const serverUtils = require('./../../server/utils');

module.exports = (domain, outputDir) => Promise.resolve()
    .then(() => debug(`Need to dump data for ${domain}.`))
    .then(() => serverUtils.getPersistence(domain))
    .then((persistence) => persistence.makeBackup(outputDir))
    .then((output) => debug(`Backup for ${domain} done: ${output}`))
;
