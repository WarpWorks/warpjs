const debug = require('./debug')('dump-data');
const serverUtils = require('./../../server/utils');

module.exports = async (domain, outputDir) => {
    debug(`Need to dump data for ${domain}.`);
    const persistence = await serverUtils.getPersistence(domain);
    try {
        const output = await persistence.makeBackup(outputDir, serverUtils.getConfig().persistence);
        debug(`Backup for ${domain} done: ${output}`);
    } finally {
        persistence.close();
    }
};
