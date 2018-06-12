const FilterBox = require('@warp-works/warpjs-filter-box');
const ProgressBarModal = require('@warp-works/progress-bar-modal');

module.exports = ($, result) => {
    ProgressBarModal.show($, 90);

    FilterBox.init($);

    ProgressBarModal.show($, 100);
    ProgressBarModal.hide();
};
