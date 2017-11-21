const cache = require('./cache');
const serverUtils = require('./../utils');
const WarpjsPlugin = require('./model');

let isInitialized = false;

module.exports = () => {
    if (!isInitialized) {
        const config = serverUtils.getConfig();

        if (config.plugins) {
            config.plugins.forEach((plugin) => cache.push(new WarpjsPlugin(config, plugin)));
        }

        isInitialized = true;
    }
};
