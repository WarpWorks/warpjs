#!/usr/bin/env node

const debug = require('debug')('W2:scripts:stats');
const Promise = require('bluebird');

const core = require('./../lib/core');

const serverUtils = require('./../server/utils');

Promise.config({
    longStackTraces: true
});


return Promise.resolve()
    .then(() => debug(`Getting persistence...`))
    .then(() => serverUtils.getPersistence())
    .then((persistence) => Promise.resolve()
        .then(() => debug(`Geting domain...`))
        .then(() => serverUtils.getDomain())
        .then((domain) => domain.getEntities())
        .then((entities) => {
            debug(`Total entities: ${entities.length}...`);
            return entities;
        })
        .then((entities) => entities.filter((entity) => !entity.isAbstract && entity.isDocument()))
        .then((entities) => {
            debug(`Processing entities: ${entities.length}...`);
            return entities;
        })
        .then((entities) => Promise.map(
            entities,
            (entity) => Promise.resolve()
                .then(() => entity.getDocuments(persistence))
                .then((docs) => [entity.name, docs.length].join(','))
        ))
        .finally(() => persistence.close())
    )
    .then((stats) => {
        debug(`Done!`);
        console.log(stats.sort().join('\n'));
    })
    .finally(() => {
        // FIXME: Something prevents the process to stop.
        process.exit();
    })
;
