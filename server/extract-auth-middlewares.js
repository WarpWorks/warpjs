const warpCore = require('./../lib/core');

function authPlugin(name, plugin) {
    return plugin.name === name;
}

module.exports = (config) => {
    const pluginName = config['auth-plugin'];
    if (pluginName) {
        const plugins = config.plugins.filter(authPlugin.bind(null, pluginName));
        if (plugins.length) {
            const Persistence = require(config.persistence.module);
            return require(pluginName).middlewares(plugins[0].config, warpCore, Persistence);
        }
    }
    return null;
};
