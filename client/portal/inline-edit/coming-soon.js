const warpjsUtils = require('@warp-works/warpjs-utils');

module.exports = ($, message) => {
    warpjsUtils.toast.warning($, message, "Coming soon...");
};
