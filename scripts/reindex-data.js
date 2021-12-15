#!/usr/bin/env node

const debug = require('debug')('W2:scripts:reindex-data');
const Promise = require('bluebird');
const warpjsPlugins = require('@warp-works/warpjs-plugins');

const serverUtils = require('./../server/utils');
const warpCore = require('./../lib/core');

(async () => {
    debug("Starting re-index process...");
    const config = serverUtils.getConfig();
    warpjsPlugins.init(config.domainName, config.persistence, config.plugins);
    const plugin = warpjsPlugins.getPlugin('search');
    if (plugin) {
        await plugin.module.initializeIndex(plugin.config);
    }
})();

Promise.resolve()
    .then(() => warpjsPlugins.getPlugin('search'))
    .then((plugin) => plugin
        ? Promise.resolve()
            .then(() => plugin.module.indexDomain(plugin.config, warpCore))
        : null
    )
    .then(() => debug("re-index process completed successfully."))
    .catch((err) => {
        // eslint-disable-next-line no-console
        console.error("re-index process error:", err);
    })
;
