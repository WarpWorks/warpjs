const warpjsUtils = require('@warp-works/warpjs-utils');

const renderer = require('./renderer');

(($) => {
    $(document).ready(() => {
        warpjsUtils.getCurrentPageHAL($).then(renderer);
    });
})(jQuery);
