const ProgressBarModal = require('@warp-works/progress-bar-modal');

const renderer = require('./template-renderer');

function defaultPostRender($, result) {
    ProgressBarModal.show($, 100);
    ProgressBarModal.hide();
}

function defaultOnError($, err) {
    console.error("ERROR:", err);
    ProgressBarModal.hide();
    window.WarpJS.toast.error($, err.message, "Error initial load");
}

module.exports = ($, template, postRender = defaultPostRender, onError = defaultOnError) => {
    // Offer a render quickly then go fetch the data and update the page.
    ProgressBarModal.show($, 25);

    $(document).ready(() => window.WarpJS.getCurrentPageHAL($)
        .then((result) => {
            ProgressBarModal.show($, 50);
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
