/**
 *  When clicking on the entity in the selection list.
 */
const Promise = require('bluebird');

const constants = require('./constants');
const query = require('./../../../query');
const template = require('./selected-entity.hbs');
const csvTemplate = require('./../relationship-panel-item-csv-item.hbs');

module.exports = ($, instanceDoc, element) => {
    instanceDoc.on('click', `${constants.DIALOG_SELECTOR} .warpjs-selection-entities .warpjs-selection-entity`, function() {
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

        return Promise.resolve()
            .then(() => {
                // Check if it's already added.
                const added = $(selector, instanceDoc);
                if (!added.length) {
                    return Promise.resolve()
                        .then(() => query($, 'POST', {id, type}, $(element).data('warpjsUrl')))
                        .then(() => template(templateData))
                        .then((content) => $(groupSelector, instanceDoc).append(content))
                        .then(() => $(`${groupSelector} .alert.alert-warning`, instanceDoc).remove())
                        .then(() => csvTemplate(templateData))
                        .then((content) => $(element).closest('.warpjs-selected-entities').append(content))
                    ;
                }
            })
            .then(() => $(`${selector} a`, instanceDoc).trigger('click'))
        ;
    });
};
