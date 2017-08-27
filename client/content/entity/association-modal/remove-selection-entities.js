const Promise = require('bluebird');

const constants = require('./constants');
const query = require('./../../../query');

module.exports = ($, instanceDoc) => {
    instanceDoc.on('click', `${constants.DIALOG_SELECTOR} .warpjs-selected-details .warpjs-remove`, function() {
        const element = $(constants.DIALOG_SELECTOR).data(constants.CURRENT_ELEMENT_KEY);
        const textarea = $(`${constants.DIALOG_SELECTOR} .warpjs-selected-details .warpjs-relationship-description`, instanceDoc);

        const id = textarea.data('warpjsId');
        const type = textarea.data('warpjsType');

        // Remove from UI immediately
        const basic = `li[data-warpjs-type="${type}"][data-warpjs-id="${id}"]`;
        $(`${constants.DIALOG_SELECTOR} .warpjs-selected-entities ${basic}`, instanceDoc).remove();
        $(basic, $(element).closest('.warpjs-selected-entities')).remove();
        // Try to select the first one to update the UI
        $(`${constants.DIALOG_SELECTOR} .warpjs-selected-entities li a`, instanceDoc).first().trigger('click');

        // Call server async
        Promise.resolve()
            .then(() => query($, 'PATCH', {id, type}, $(element).data('warpjsUrl')))
            .catch((err) => {
                // TODO: Give UI feedback on error
                console.log("Error removing association", err);
            })
        ;
    });
};
