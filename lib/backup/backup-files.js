const path = require('path');
const shelljs = require('shelljs');

const debug = require('./debug')('backup-files');
const serverUtils = require('./../../server/utils');

const config = serverUtils.getConfig();

const foldersToBackup = [
    'domains',
    'logs',
    'public'
];
const SRC = foldersToBackup.map((subfolder) => path.resolve(config.folders.w2projects, subfolder));

module.exports = async (outputDir) => {
    debug(`Copying data files to '${outputDir}'...`);
    shelljs.cp('-R', SRC, outputDir);
    debug("    ...Copied data files");
};
