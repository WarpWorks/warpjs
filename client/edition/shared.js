const FilterBox = require('@warp-works/warpjs-filter-box');
const ProgressBarModal = require('@warp-works/progress-bar-modal');

const checkChrome = require('./check-chrome');

module.exports = ($) => {
    ProgressBarModal.show($, 90);

    FilterBox.init($);

    checkChrome($);

    ProgressBarModal.show($, 100);
    ProgressBarModal.hide();
};
