/**
 *  When clicking on the entity in the selection list.
 */
const Promise = require('bluebird');

const constants = require('./constants');
const query = require('./../../../query');
const template = require('./selected-entity.hbs');
const csvTemplate = require('./../relationship-panel-item-csv-item.hbs');

module.exports = ($, instanceDoc) => {
    instanceDoc.on('click', `${constants.DIALOG_SELECTOR} .warpjs-selection-entities .warpjs-selection-entity`, function() {
        const element = $(constants.DIALOG_SELECTOR).data(constants.CURRENT_ELEMENT_KEY);

        const id = $(this).data('warpjsId');
        const type = $(this).data('warpjsType');

        const groupSelector = `${constants.DIALOG_SELECTOR} .warpjs-selected-entities`;
        const selector = `${groupSelector} [data-warpjs-id="${id}"][data-warpjs-type="${type}"]`;
        const docLevel = [$(element).data('warpjsDocLevel'), `Entity:${id}`].join('.');

        const templateData = {
            idx: -1,
            type,
            id,
            displayName: $(this).data('warpjsDisplayName'),
            relnDesc: '',
            docLevel
        };

        const added = $(selector, instanceDoc);
        if (!added.length) {
            $(`${groupSelector} .alert.alert-warning`, instanceDoc).remove();
            $(groupSelector, instanceDoc).append(template(templateData));
            $(element).closest('.warpjs-selected-entities').append(csvTemplate(templateData));

            // Call this async
            Promise.resolve()
                .then(() => query($, 'POST', {id, type}, $(element).data('warpjsUrl')))
                .catch((err) => {
                    // TODO: give UI feedback.
                    console.log("Error adding data to server:", err);
                });
        }
        $(`${selector} a`, instanceDoc).trigger('click');
    });
};
