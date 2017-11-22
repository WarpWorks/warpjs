const Promise = require('bluebird');

const warpjsPlugins = require('@warp-works/warpjs-plugins');

module.exports = (persistence, entity, instance, user) => Promise.resolve()
    .then(() => warpjsPlugins.getPlugin('session'))
    .then((plugin) => plugin
        ? plugin.module.canEdit(plugin.config, persistence, entity, instance, user)
        : true // If no session plugin, assume everyone has write access.
    )
;
