const path = require('path');
const Promise = require('bluebird');
const shelljs = require('shelljs');

const archiveFiles = require('./archive-files');
const backupFiles = require('./backup-files');
const cleanup = require('./cleanup');
const constants = require('./../constants');
const debug = require('./debug')('index');
const dumpData = require('./dump-data');
const warpjsCore = require('./../core');

const outputDirname = ['warpjs-backup', (new Date()).toISOString().replace(/:/g, '').replace(/-/g, '')].join('-');
const outputDir = path.join('/tmp', outputDirname);

module.exports = async () => {
    try {
        shelljs.mkdir('-p', outputDir);
        debug(`Created output folder '${outputDir}'.`);
        await backupFiles(outputDir);

        const persistence = await warpjsCore.getPersistence();
        try {
            debug(`Process core '${constants.CORE.DOMAIN}'...`);
            await dumpData(constants.CORE.DOMAIN, outputDir);
            debug(`Done with core '${constants.CORE.DOMAIN}'.`);
            const dbDomains = await warpjsCore.listDomains(persistence);

            await Promise.each(
                dbDomains,
                async (domainInfo) => {
                    debug(`Process domain '${domainInfo.name}'...`, domainInfo);
                    await dumpData(domainInfo.name, outputDir);
                    debug(`Done with domain '${domainInfo.name}'.`);
                }
            );

            await archiveFiles(outputDir);
        } catch (err) {
        } finally {
            persistence.close();
        }
    } finally {
        await cleanup(outputDir);
    }
};
