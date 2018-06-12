const FilterBox = require('@warp-works/warpjs-filter-box');
const ProgressBarModal = require('@warp-works/progress-bar-modal');

const deleteInstance = require('./delete-instance');

module.exports = ($, result) => {
    ProgressBarModal.show($, 80);

    deleteInstance($);
    FilterBox.init($);

    ProgressBarModal.show($, 100);
    ProgressBarModal.hide();
};
