const deleteInstance = require('./delete-instance');
const progressBarModal = require('./../progress-bar-modal');

module.exports = ($, result) => {
    progressBarModal.show($, 80);

    deleteInstance($);

    progressBarModal.show($, 100);
    progressBarModal.hide();
};
