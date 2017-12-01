const debug = require('debug')('W2:search:index-document');
const Promise = require('bluebird');
// const warpjsPlugins = require('@warp-works/warpjs-plugins');

module.exports = (persistence, entity, doc) => Promise.resolve()
    .then(() => debug("Starting: doc=", doc))
    // .then(() => warpjsPlugins.getPlugin('search'))
    // .then((plugin) => plugin
    //     ? Promise.resolve()
    //         .then(() => plugin.module.indexDocument(plugin.config, persistence, entity, doc))
    //     : null
    // )
    .then(() => debug("done!"))
;
