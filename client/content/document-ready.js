const warpjsUtils = require('@warp-works/warpjs-utils');

const progressBarModal = require('./progress-bar-modal');
const renderer = require('./template-renderer');

function defaultPostRender($, result) {
    progressBarModal.show($, 100);
    progressBarModal.hide();
}

function defaultOnError($, err) {
    console.log("ERROR:", err);
}

module.exports = ($, template, postRender = defaultPostRender, onError = defaultOnError) => {
    // Offer a render quickly then go fetch the data and update the page.
    progressBarModal.show($, 25);

    $(document).ready(() => {
        return warpjsUtils.getCurrentPageHAL($)
            .then((result) => {
                progressBarModal.show($, 50);
                if (result.error) {
                    return onError($, result);
                }
                renderer(template, result);
                return result;
            })
            .then((result) => postRender($, result))
            .catch(onError);
    });
};
