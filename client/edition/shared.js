const ProgressBarModal = require('@warp-works/progress-bar-modal');

const checkChrome = require('./check-chrome');

module.exports = ($) => {
    ProgressBarModal.show($, 90);

    checkChrome($);

    ProgressBarModal.show($, 100);
    ProgressBarModal.hide();
};
