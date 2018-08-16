const ProgressBarModal = require('@warp-works/progress-bar-modal');

const shared = require('./../shared');

const deleteInstance = require('./delete-instance');

module.exports = ($, result) => {
    ProgressBarModal.show($, 80);

    deleteInstance($);

    shared($);
};
