const _ = require('lodash');
const Promise = require('bluebird');
const warpjsUtils = require('@warp-works/warpjs-utils');

const cache = require('./cache');
// const progressBarModal = require('./../progress-bar-modal');

module.exports = ($, url, overrideCache) => {
    return Promise.resolve()
        .then(() => {
            if (overrideCache || !cache[url]) {
                const ajaxOptions = {
                    method: 'GET',
                    url,
                    headers: {
                        accept: warpjsUtils.constants.HAL_CONTENT_TYPE
                    }
                };

                return Promise.resolve()
                    // .then(() => progressBarModal.show($, 25))
                    .then(() => $.ajax(ajaxOptions))
                    .then((res) => {
                        // progressBarModal.show($, 75);
                        cache[url] = res;
                        // progressBarModal.show($, 100);
                    })
                    // .then(() => progressBarModal.hide())
                ;
            }
        })
        .then(() => _.cloneDeep(cache[url]))
        .catch(() => {
            throw new Error(`Cannot GET ${url}.`);
        });
};
