#!/usr/bin/env node

// const debug = require('debug')('W2:scripts:dump-domain');
const Promise = require('bluebird');

const serverUtils = require('./../server/utils');

Promise.config({
    longStackTraces: true
});

Promise.resolve()
    .then(() => serverUtils.getDomain())
    .then((domain) => domain.toJSON())
    .then((json) => JSON.stringify(json, null, 2))
    // eslint-disable-next-line no-console
    .then(console.log)
;
