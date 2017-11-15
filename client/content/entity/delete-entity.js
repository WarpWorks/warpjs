const Promise = require('bluebird');
const warpjsUtils = require('@warp-works/warpjs-utils');

module.exports = ($) => {
    $(document).on('click', '[data-warpjs-action="delete"][data-warpjs-url]:not([disabled])', function() {
        return Promise.resolve()
            .then(() => warpjsUtils.proxy.del($, $(this).data('url')))
            .then((res) => {
                console.log("res=", res);
            })
            .catch((err) => {
                console.log("res ERRORS=", err);
            })
            .finally(() => {
            });
    });
};
