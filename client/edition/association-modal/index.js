const Promise = require('bluebird');

const addSelectionEntities = require('./add-selection-entities');
const browseSelectedEntities = require('./browse-selected-entities');
const constants = require('./constants');
const events = require('./events');
const initializeSelectedEntities = require('./initialize-selected-entities');
const relationshipDescriptionModified = require('./relationship-description-modified');
const removeSelectionEntities = require('./remove-selection-entities');
const selectionTypesOnChange = require('./selection-types-on-change');
const template = require('./template.hbs');
const updateSelectedDetails = require('./update-selected-details');
const updateSelectionTypes = require('./update-selection-types');

module.exports = ($, instanceDoc) => {
    instanceDoc.on('click', '[data-warpjs-action="relationship-csv-modal"]', function() {
        // Only define the event handlers the first time we add the modal.
        if (!$(constants.DIALOG_SELECTOR, instanceDoc).length) {
            instanceDoc.append(template({
                canEdit: $(this).data('warpjsCanEdit') === 'true' || $(this).data('warpjsCanEdit') === true,
                modalName: constants.MODAL_NAME,
                selectedDetails: constants.SELECTED_DETAILS,
                selectedEntities: constants.SELECTED_ENTITIES,
                selectionEntities: constants.SELECTION_ENTITIES,
                selectionSave: constants.SELECTION_SAVE,
                selectionTypes: constants.SELECTION_TYPES
            }));

            browseSelectedEntities($, instanceDoc);
            relationshipDescriptionModified($, instanceDoc);
            addSelectionEntities($, instanceDoc);
            removeSelectionEntities($, instanceDoc);
            selectionTypesOnChange($, instanceDoc);

            events($, instanceDoc);
        }
        $(constants.DIALOG_SELECTOR, instanceDoc).modal('show');

        return Promise.resolve()
            // Set the current element to be referenced by other event handlers.
            .then(() => $(constants.DIALOG_SELECTOR, instanceDoc).data(constants.CURRENT_ELEMENT_KEY, this))
            .then(() => initializeSelectedEntities($, instanceDoc))
            .then(() => updateSelectedDetails($, instanceDoc))
            .then(() => updateSelectionTypes($, instanceDoc))
        ;
    });
};
