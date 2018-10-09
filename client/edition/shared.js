const ProgressBarModal = require('@warp-works/progress-bar-modal');

const checkChrome = require('./check-chrome');

module.exports = ($, result) => {
    ProgressBarModal.show($, 90);

    checkChrome($);

    ProgressBarModal.show($, 100);
    ProgressBarModal.hide();

    $('#warpjs-content-placeholder').data('customMessages', result && result.customMessages ? result.customMessages : {});
};
