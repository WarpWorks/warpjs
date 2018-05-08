#!/usr/bin/env node

/**
 *  This script will take domains on file and put them into the database.
 */

const _ = require('lodash');
const debug = require('debug')('W2:scripts:import-domains-to-db');
const path = require('path');
const Promise = require('bluebird');

const createDomainFromJSONString = require('./../lib/core/file-schema/create-domain-from-json-string');
const models = require('./../lib/core/models');
const warpCore = require('./../lib/core');

Promise.config({
    longStackTraces: true
});

function readDomainFromFile(domainInfo) {
    const content = warpCore.readFile(domainInfo.filePath);
    return createDomainFromJSONString(content);
}

function domainFiles() {
    const files = warpCore.readDir('domains');
    const cwd = process.cwd();

    return files.map((file) => ({
        name: path.basename(file, '.jsn'),
        desc: 'TBD: Description',
        filePath: path.resolve(cwd, file)
    }));
}

Promise.resolve()
    .then(() => warpCore.getPersistence())
    .then((persistence) => Promise.resolve()
        .then(() => warpCore.listDomains(persistence))
        .then((existingDomains) => existingDomains.reduce(
            (memo, domain) => _.extend(memo, {
                [domain.name]: domain
            }),
            {}
        ))
        .then((existingDomains) => Promise.resolve()
            .then(() => debug("Existing domains:", existingDomains))
            .then(() => Promise.each(
                domainFiles(),
                (domainInfo, index, length) => Promise.resolve()
                    .then(() => debug("Trying to import:", domainInfo))
                    .then(() => {
                        if (existingDomains[domainInfo.name]) {
                            console.log(`Domain '${domainInfo.name}' already imported. Skipping...`);
                        } else {
                            return Promise.resolve()
                            .then(() => readDomainFromFile(domainInfo))
                            .then((domain) => domain.save(persistence))
                            .then((res) => debug(`Domain '${domainInfo.name}': domain.save():`, res))
                            .catch((err) => {
                                console.error(`Error importing '${domainInfo.name}'.`);
                                throw err;
                            })
                        }
                    })
            ))
        )
        .catch((err) => {
            console.error("Error importing:", err);
        })
        .finally(() => persistence.close())
    )
;
