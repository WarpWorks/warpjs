const _ = require('lodash');
// const debug = require('debug')('W2:server:plugins');

const warpCore = require('./../lib/core');

function register(app, config, Persistence, baseUrl, staticUrl) {
    baseUrl = (baseUrl === '/') ? '' : baseUrl;

    config.plugins.forEach((plugin) => {
        const pluginConfig = _.extend({}, plugin.config, {
            persistence: {
                host: config.persistence.host,
                name: config.persistence.name
            }
        });

        const pluginApp = require(plugin.name)(pluginConfig, warpCore, Persistence);
        app.use(plugin.path, pluginApp(baseUrl ? `${baseUrl}/${plugin.path}` : plugin.path, staticUrl));
    });
}

module.exports = {
    register
};
