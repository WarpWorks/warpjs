const FilterBox = require('@warp-works/warpjs-filter-box');

const progressBarModal = require('./../progress-bar-modal');

module.exports = ($, result) => {
    progressBarModal.show($, 90);

    FilterBox.init($);

    progressBarModal.show($, 100);
    progressBarModal.hide();
};
