const Promise = require('bluebird');
const warpjsUtils = require('@warp-works/warpjs-utils');

module.exports = ($, element) => Promise.resolve()
    .then(() => warpjsUtils.toast.warning($, "This can take few seconds. Page will redirect when done.", "Processing..."))
    .then(() => ({
        warpjsAction: $(element).data('warpjsAction')
    }))
    .then((data) => warpjsUtils.proxy.post($, $(element).data('warpjsUrl'), data))
    .then((res) => {
        document.location.href = res._links.redirect.href;
    })
    .catch((err) => {
        console.error("failed: err=", err);
        warpjsUtils.toast.error($, err.message, "Action error");
    })
;
