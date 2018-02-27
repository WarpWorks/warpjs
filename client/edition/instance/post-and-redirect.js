const Promise = require('bluebird');
const warpjsUtils = require('@warp-works/warpjs-utils');

module.exports = ($, element) => Promise.resolve()
    .then(() => warpjsUtils.proxy.post($, $(element).data('warpjsUrl')))
    .then((res) => {
        document.location.href = res._links.redirect.href;
    })
    .catch((err) => {
        console.error("failed: err=", err);
        warpjsUtils.toast.error($, err.message, "Action error");
    });
;
