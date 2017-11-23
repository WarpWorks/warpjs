const cache = require('./cache');
const init = require('./init');

module.exports = (app, config, Persistence, baseUrl, staticUrl) => {
    init();

    baseUrl = (baseUrl === '/') ? '' : baseUrl;

    cache.forEach((warpjsPlugin) => {
        warpjsPlugin.use(Persistence, app, baseUrl, staticUrl);
    });
};
