const debug = require('debug')('W2:backup:backupSchema');
const path = require('path');
const Promise = require('bluebird');
const shelljs = require('shelljs');

const serverUtils = require('./../../server/utils');

const config = serverUtils.getConfig();

const foldersToBackup = [
    'domains',
    'logs',
    'public'
];
const SRC = foldersToBackup.map((subfolder) => path.resolve(config.folders.w2projects, subfolder));

module.exports = (outputDir) => Promise.resolve()
    .then(() => debug(`Copying data files to '${outputDir}'...`))
    .then(() => shelljs.cp('-R', SRC, outputDir))
    .then(() => debug("    ...Copied data files"))
;
