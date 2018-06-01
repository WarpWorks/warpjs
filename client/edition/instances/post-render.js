const FilterBox = require('@warp-works/warpjs-filter-box');

const deleteInstance = require('./delete-instance');
const progressBarModal = require('./../progress-bar-modal');

module.exports = ($, result) => {
    progressBarModal.show($, 80);

    deleteInstance($);
    FilterBox.init($);

    progressBarModal.show($, 100);
    progressBarModal.hide();
};
