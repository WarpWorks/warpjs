/**
 *  When clicking on the entity in the selection list.
 */
const Promise = require('bluebird');

const constants = require('./constants');
const post = require('./../../../post');

module.exports = ($, instanceDoc, element) => {
    instanceDoc.on('click', `${constants.DIALOG_SELECTOR} .warpjs-selection-entities .warpjs-selection-entity`, function() {
        const id = $(this).data('warpjsId');
        const type = $(this).data('warpjsType');

        return Promise.resolve()
            .then(() => {
                // Check if it's already added.
                const added = $(`${constants.DIALOG_SELECTOR} .warpjs-selected-entities [data-warpjs-id="${id}"][data-warpjs-type="${type}"]`);
                if (!added.length) {
                    return post($, $(element).data('warpjsDocLevel'), {id, type});
                }
            });
    });
};
