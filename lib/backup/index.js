const debug = require('debug')('W2:backup:index');
const path = require('path');
const Promise = require('bluebird');
const shelljs = require('shelljs');

const archiveFiles = require('./archive-files');
const backupFiles = require('./backup-files');
const cleanup = require('./cleanup');
const dumpData = require('./dump-data');
const warpjsCore = require('./../core');

const outputDirname = ['warpjs-backup', (new Date()).toISOString()].join('-');
const outputDir = path.join('/tmp', outputDirname);

module.exports = () => Promise.resolve()
    .then(() => shelljs.mkdir('-p', outputDir))
    .then(() => debug(`Created output folder '${outputDir}'.`))
    .then(() => backupFiles(outputDir))
    .then(() => Promise.each(warpjsCore.domainFiles(),
        (domainInfo) => Promise.resolve()
            .then(() => debug(`Process domain '${domainInfo.name}'...`, domainInfo))
            .then(() => dumpData(domainInfo.name, outputDir))
            .then(() => debug(`Done with domain '${domainInfo.name}'.`))
    ))
    .then(() => archiveFiles(outputDir))
    .finally(() => cleanup(outputDir))
;
