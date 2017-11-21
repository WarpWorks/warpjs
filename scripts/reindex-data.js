#!/usr/bin/env node

const debug = require('debug')('W2:scripts:reindex-data');
const Promise = require('bluebird');

const plugins = require('./../server/plugins');
const warpCore = require('./../lib/core');

Promise.resolve()
    .then(() => debug("Starting re-index process..."))
    .then(() => plugins.getTypedPlugin('search'))
    .then((plugin) => plugin
        ? Promise.resolve()
            .then(() => plugin.module.initializeIndex(plugin.config))
            .then(() => plugin.module.indexDomain(plugin.config, warpCore))
        : null
    )
    .then(() => debug("re-index process completed successfully."))
    .catch((err) => console.log("re-index process error:", err))
;
