#!/usr/bin/env node

const backup = require('./../lib/backup');
const debug = require('./debug')('backup-data');

const main = async () => {
    try {
        debug(`Start backup process`);
        await backup();
        debug("Backup process completed successfully.");
    } catch (err) {
        // eslint-disable-next-line no-console
        console.error("Backup process error:", err);
    }
};

(async () => {
    await main();
})();
