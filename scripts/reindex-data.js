#!/usr/bin/env node

const debug = require('debug')('W2:scripts:reindex-data');
const Promise = require('bluebird');
const warpjsPlugins = require('@warp-works/warpjs-plugins');

const serverUtils = require('./../server/utils');
const warpCore = require('./../lib/core');

Promise.resolve()
    .then(() => debug("Starting re-index process..."))
    .then(() => serverUtils.getConfig())
    .then((config) => warpjsPlugins.init(config.domainName, config.persistence, config.plugins))
    .then(() => warpjsPlugins.getPlugin('search'))
    .then((plugin) => plugin
        ? Promise.resolve()
            .then(() => plugin.module.initializeIndex(plugin.config))
            .then(() => plugin.module.indexDomain(plugin.config, warpCore))
        : null
    )
    .then(() => debug("re-index process completed successfully."))
    .catch((err) => console.log("re-index process error:", err))
;
