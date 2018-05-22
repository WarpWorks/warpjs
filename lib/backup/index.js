const debug = require('debug')('W2:backup:index');
const path = require('path');
const Promise = require('bluebird');
const shelljs = require('shelljs');

const archiveFiles = require('./archive-files');
const backupFiles = require('./backup-files');
const cleanup = require('./cleanup');
const constants = require('./../constants');
const dumpData = require('./dump-data');
const warpjsCore = require('./../core');

const outputDirname = ['warpjs-backup', (new Date()).toISOString().replace(/:/g, '').replace(/-/g, '')].join('-');
const outputDir = path.join('/tmp', outputDirname);

module.exports = () => Promise.resolve()
    .then(() => shelljs.mkdir('-p', outputDir))
    .then(() => debug(`Created output folder '${outputDir}'.`))
    .then(() => backupFiles(outputDir))
    .then(() => warpjsCore.getPersistence())
    .then((persistence) => Promise.resolve()
        .then(() => debug(`Process core '${constants.CORE.DOMAIN}'...`))
        .then(() => dumpData(constants.CORE.DOMAIN, outputDir))
        .then(() => debug(`Done with core '${constants.CORE.DOMAIN}'.`))
        .then(() => warpjsCore.listDomains(persistence))
        .then((dbDomains) => Promise.each(dbDomains,
            (domainInfo) => Promise.resolve()
                .then(() => debug(`Process domain '${domainInfo.name}'...`, domainInfo))
                .then(() => dumpData(domainInfo.name, outputDir))
                .then(() => debug(`Done with domain '${domainInfo.name}'.`))
        ))
        .then(() => archiveFiles(outputDir))
        .finally(() => persistence.close())
    )
    .finally(() => cleanup(outputDir))

;
