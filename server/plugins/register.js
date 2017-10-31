const WarpjsPlugin = require('./model');

module.exports = (app, config, Persistence, baseUrl, staticUrl) => {
    baseUrl = (baseUrl === '/') ? '' : baseUrl;

    config.plugins.forEach((plugin) => {
        const warpjsPlugin = new WarpjsPlugin(config, plugin);
        warpjsPlugin.use(Persistence, app, baseUrl, staticUrl);
    });
};
