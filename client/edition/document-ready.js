const warpjsUtils = require('@warp-works/warpjs-utils');

const progressBarModal = require('./progress-bar-modal');
const renderer = require('./template-renderer');

function defaultPostRender($, result) {
    progressBarModal.show($, 100);
    progressBarModal.hide();
}

function defaultOnError($, err) {
    console.error("ERROR:", err);
    progressBarModal.hide();
    warpjsUtils.toast.error($, err.message, "Error initial load");
}

module.exports = ($, template, postRender = defaultPostRender, onError = defaultOnError) => {
    // Offer a render quickly then go fetch the data and update the page.
    progressBarModal.show($, 25);

    $(document).ready(() => warpjsUtils.getCurrentPageHAL($)
        .then((result) => {
            progressBarModal.show($, 50);
            if (result.error) {
                onError($, result);
            } else {
                renderer(template, result);
                postRender($, result);
            }
        })
        .catch((err) => onError($, err))
    );
};
