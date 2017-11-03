const del = require('./del');
const get = require('./get');
const patch = require('./patch');
const post = require('./post');

module.exports = {
    del: ($, url, data) => del($, url, data),
    get: ($, url, overrideCache) => get($, url, overrideCache),
    patch: ($, url, data) => patch($, url, data),
    post: ($, url, data) => post($, url, data)
};
