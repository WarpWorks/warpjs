const createNewEntity = require('./create-new-entity');
const deleteInstance = require('./delete-instance');
const progressBarModal = require('./../progress-bar-modal');

module.exports = ($, result) => {
    progressBarModal.show($, 80);

    createNewEntity($);
    deleteInstance($);

    progressBarModal.show($, 100);
    progressBarModal.hide();
};
