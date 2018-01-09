/**
 *  This script will take domains on file and put them into the database.
 */

const _ = require('lodash');
const debug = require('debug')('W2:scripts:import-domains-to-db');
const Promise = require('bluebird');

const constants = require('./../lib/core/constants');
const models = require('./../lib/core/models');
const serverUtils = require('./../server/utils');
const warpCore = require('./../lib/core');

function readDomainFromFile(domainInfo) {
    const content = warpCore.readFile(domainInfo.filePath);
    return warpCore.createDomainFromJSONString(content);
}

Promise.resolve()
    .then(() => serverUtils.getPersistence(constants.DB_NAME))
    .then((persistence) => Promise.resolve()
        .then(() => models.Domain.list(persistence))
        .then((domains) => domains.reduce(
            (memo, domain) => _.extend(memo, {
                [domain.name]: domain
            }),
            {}
        ))
        .then((domains) => Promise.resolve()
            .then(() => debug("Existing domains:", domains))
            .then(() => Promise.each(
                warpCore.domainFiles(),
                (domainInfo, index, length) => Promise.resolve()
                    .then(() => debug("Trying to import:", domainInfo))
                    .then(() => {
                        if (domains[domainInfo.name]) {
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
