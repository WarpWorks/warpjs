const debug = require('debug')('W2:backup:index');
const fs = require('fs');
const path = require('path');
const Promise = require('bluebird');

const backupSchema = require('./backup-schema');
const cleanup = require('./cleanup');
const dumpData = require('./dump-data');
const warpjsCore = require('./../core');

const mkdir = Promise.promisify(fs.mkdir);

const outputDir = path.join('/tmp', (new Date()).toISOString().replace(/\D/g, ''));

module.exports = () => Promise.resolve()
    .then(() => mkdir(outputDir))
    .then(() => Promise.each(warpjsCore.domainFiles(), (domainInfo) => Promise.resolve()
        .then(() => debug(`Process domain '${domainInfo.name}'...`))
        .then(() => backupSchema(domainInfo.filePath, outputDir))
        .then(() => dumpData(domainInfo.name, outputDir))
        .then(() => debug(`Done with domain '${domainInfo.name}'.`))
    ))
    .finally(() => cleanup(outputDir))
;
