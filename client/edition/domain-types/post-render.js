const filterBox = require('./../filter-box');
const progressBarModal = require('./../progress-bar-modal');

module.exports = ($, result) => {
    progressBarModal.show($, 90);

    filterBox($);

    progressBarModal.show($, 100);
    progressBarModal.hide();
};
