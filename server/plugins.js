const debug = require('debug')('W2:server:plugins');

const warpCore = require('./../lib/core');

function register(app, config, baseUrl, staticUrl) {
    debug('Registering plug-ins');
    baseUrl = (baseUrl === '/') ? '' : baseUrl;

    config.plugins.forEach((plugin) => {
        const pluginApp = require(plugin.name)(plugin.config, warpCore);
        app.use(plugin.path, pluginApp(baseUrl ? `${baseUrl}/${plugin.path}` : plugin.path, staticUrl));
    });
}

module.exports = {
    register
};
