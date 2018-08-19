const ProgressBarModal = require('@warp-works/progress-bar-modal');

const shared = require('./../shared');

module.exports = ($, result) => {
    ProgressBarModal.show($, 80);

    shared($);
};
