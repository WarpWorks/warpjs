const _ = require('lodash');
const Promise = require('bluebird');
const warpjsUtils = require('@warp-works/warpjs-utils');

const cache = require('./cache');

module.exports = ($, url, overrideCache) => {
    const ajaxOptions = {
        method: 'GET',
        url,
        headers: {
            accept: warpjsUtils.constants.HAL_CONTENT_TYPE
        }
    };

    return Promise.resolve()
        .then(() => {
            if (overrideCache || !cache[url]) {
                return Promise.resolve()
                    .then(() => $.ajax(ajaxOptions))
                    .then((res) => {
                        cache[url] = res;
                    });
            }
        })
        .then(() => _.cloneDeep(cache[url]))
        .catch(() => {
            throw new Error(`Cannot GET ${url}.`);
        });
};
