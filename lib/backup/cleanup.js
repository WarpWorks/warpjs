const shelljs = require('shelljs');

const debug = require('./debug')('cleanup');

module.exports = async (folder) => {
    debug(`Need to clean up folder '${folder}'.`);
    shelljs.rm('-rf', folder);
    debug(`... clean up done.`);
};
