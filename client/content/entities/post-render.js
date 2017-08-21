const createNewEntity = require('./create-new-entity');
const progressBarModal = require('./../progress-bar-modal');

module.exports = ($, result) => {
    progressBarModal.show($, 80);

    createNewEntity($);

    progressBarModal.show($, 100);
    progressBarModal.hide();
};
