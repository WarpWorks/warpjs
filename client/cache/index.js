const _ = require('lodash');

const cache = {};

module.exports = {
    get(url) {
        return _.cloneDeep(cache[url]);
    },

    set(url, value) {
        cache[url] = value;
        return this;
    },

    has(url) {
        return !!cache[url];
    }
};
