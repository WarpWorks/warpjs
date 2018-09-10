/**
 *  When clicking on the entity in the selection list.
 */
const Promise = require('bluebird');
const { proxy, toast } = require('@warp-works/warpjs-utils');

const ChangeLogs = require('./../change-logs');
const constants = require('./constants');
const globalConstants = require('./../../../lib/constants');
const template = require('./selected-entity.hbs');
const csvTemplate = require('./../instance/relationship-panel-item-csv-item.hbs');

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
            // Call this async
            Promise.resolve()
                .then(() => proxy.post($, $(element).data('warpjsUrl'), {
                    id,
                    type,
                    docLevel,
                    action: globalConstants.actions.ADD_ASSOCIATION
                }))
                .then(() => ChangeLogs.dirty())
                .then(() => {
                    $(`${groupSelector} .alert.alert-warning`, instanceDoc).remove();
                    $(groupSelector, instanceDoc).append(template(templateData));
                    $(element).closest('.warpjs-selected-entities').append(csvTemplate(templateData));
                    $(`${selector} a`, instanceDoc).trigger('click');
                })
                .catch((err) => {
                    console.error("Error adding data to server:", err);
                    toast.error($, err.message, "Error adding association");
                });
        } else {
            $(`${selector} a`, instanceDoc).trigger('click');
        }
    });
};
