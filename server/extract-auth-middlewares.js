const warpjsPlugins = require('@warp-works/warpjs-plugins');

const warpCore = require('./../lib/core');

module.exports = () => {
    const plugin = warpjsPlugins.getPlugin('session');

    if (plugin) {
        const Persistence = require(plugin.config.persistence.module);
        return plugin.module.middlewares(plugin.config, warpCore, Persistence);
    } else {
        return null;
    }
};
