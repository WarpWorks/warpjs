const deleteInstance = require('./delete-instance');
const filterBox = require('./../filter-box');
const progressBarModal = require('./../progress-bar-modal');

module.exports = ($, result) => {
    progressBarModal.show($, 80);

    deleteInstance($);
    filterBox($);

    progressBarModal.show($, 100);
    progressBarModal.hide();
};
