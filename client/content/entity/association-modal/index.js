const Promise = require('bluebird');

const addSelectionEntities = require('./add-selection-entities');
const browseSelectedEntities = require('./browse-selected-entities');
const constants = require('./constants');
const initializeSelectedEntities = require('./initialize-selected-entities');
const progressBarModal = require('./../../progress-bar-modal');
const relationshipDescriptionModified = require('./relationship-description-modified');
const removeSelectionEntities = require('./remove-selection-entities');
const template = require('./template.hbs');
const updateSelectedDetails = require('./update-selected-details');
const updateSelectionTypes = require('./update-selection-types');

module.exports = ($, instanceDoc) => {
    instanceDoc.on('click', '[data-warpjs-action="relationship-csv-modal"]', function() {
        progressBarModal.show($, 20);
        return Promise.resolve()
            .then(() => {
                progressBarModal.show($, 25);
                if (!$(constants.DIALOG_SELECTOR, instanceDoc).length) {
                    const content = template();
                    instanceDoc.append(content);

                    browseSelectedEntities($, instanceDoc);
                    relationshipDescriptionModified($, instanceDoc);
                    addSelectionEntities($, instanceDoc, this);
                    removeSelectionEntities($, instanceDoc, this);
                }
            })
            .then(() => progressBarModal.show($, 40))
            .then(() => initializeSelectedEntities($, instanceDoc, this))
            .then(() => progressBarModal.show($, 50))
            .then(() => updateSelectedDetails($, instanceDoc))
            .then(() => progressBarModal.show($, 60))
            .then(() => updateSelectionTypes($, instanceDoc, this))
            .then(() => progressBarModal.show($, 90))
            .then(() => $(constants.DIALOG_SELECTOR, instanceDoc).modal('show'))
            .then(() => progressBarModal.show($, 100))
            .finally(() => progressBarModal.hide())
        ;
    });
};
