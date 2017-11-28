const warpjsPlugins = require('@warp-works/warpjs-plugins');

const warpCore = require('./../lib/core');

module.exports = () => {
    const plugin = warpjsPlugins.getPlugin('session');
    if (plugin) {
        return plugin.module.middlewares(plugin.config, warpCore, plugin.Persistence);
    } else {
        return null;
    }
};
