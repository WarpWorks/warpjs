// const debug = require('debug')('W2:server:plugins');

const WarpjsPlugin = require('./warpjs-plugin');

function register(app, config, Persistence, baseUrl, staticUrl) {
    baseUrl = (baseUrl === '/') ? '' : baseUrl;

    config.plugins.forEach((plugin) => {
        const warpjsPlugin = new WarpjsPlugin(config, plugin);
        warpjsPlugin.use(Persistence, app, baseUrl, staticUrl);
    });
}

module.exports = {
    register
};
