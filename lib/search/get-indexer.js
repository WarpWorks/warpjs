const serverUtils = require('./../../server/utils');

let cached;

module.exports = () => {
    if (!cached) {
        cached = (serverUtils.getConfig().plugins || []).filter((plugin) => plugin.type === 'search').pop();
    }
    return cached;
};
