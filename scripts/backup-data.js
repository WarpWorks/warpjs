#!/usr/bin/env node

const debug = require('debug')('W2:scripts:backup');
const Promise = require('bluebird');

const backup = require('./../lib/backup');

Promise.resolve()
    .then(() => debug("Start backup process"))
    .then(() => backup())
    .then(() => debug("Backup process completed successfully."))
    .catch((err) => {
        // eslint-disable-next-line no-console
        console.error("Backup process error:", err);
    })
;
