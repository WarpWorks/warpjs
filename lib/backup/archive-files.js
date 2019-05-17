const path = require('path');
const Promise = require('bluebird');
const shelljs = require('shelljs');

const debug = require('./debug')('archive-files');
const serverUtils = require('./../../server/utils');
const WarpWorksError = require('./../core/error');

const config = serverUtils.getConfig();

const DEST_DIR = path.resolve(config.folders.w2projects, 'backups');

const compress = async (src, dest) => new Promise((resolve, reject) => {
    shelljs.exec(`tar zcf "${dest}" -C "${src}" "."`, (code, stdout, stderr) => {
        if (code) {
            reject(new WarpWorksError("Failed archiving", {
                code,
                stdout,
                stderr
            }));
        } else {
            resolve();
        }
    });
});

module.exports = async (outputDir) => {
    const dest = path.resolve(DEST_DIR, `${path.basename(outputDir)}.tgz`);
    debug(`Archiving files to "${dest}"...`);
    shelljs.mkdir('-p', DEST_DIR);
    await compress(outputDir, dest);
    debug(`...archiving done.`);
};
