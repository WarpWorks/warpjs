const warpCore = require('./../lib/core');
const getAuthPlugin = require('./plugins/get-auth-plugin');

module.exports = (config) => {
    const plugin = getAuthPlugin(config);
    if (plugin) {
        const Persistence = require(config.persistence.module);
        return require(plugin.name).middlewares(plugin.config, warpCore, Persistence);
    } else {
        return null;
    }
};
