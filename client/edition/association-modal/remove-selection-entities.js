const Promise = require('bluebird');

const ChangeLogs = require('./../change-logs');
const constants = require('./constants');

module.exports = ($, instanceDoc) => {
    instanceDoc.on('click', `${constants.DIALOG_SELECTOR} .warpjs-selected-details .warpjs-remove`, function() {
        const element = $(constants.DIALOG_SELECTOR).data(constants.CURRENT_ELEMENT_KEY);
        const textarea = $(`${constants.DIALOG_SELECTOR} .warpjs-selected-details .warpjs-relationship-description`, instanceDoc);

        const id = textarea.data('warpjsId');
        const type = textarea.data('warpjsType');
        const updatePath = textarea.data('warpjsDocLevel');
        const patchAction = 'remove';

        // Remove from UI immediately
        const basic = `li[data-warpjs-type="${type}"][data-warpjs-id="${id}"]`;
        $(`${constants.DIALOG_SELECTOR} .warpjs-selected-entities ${basic}`, instanceDoc).remove();
        $(basic, $(element).closest('.warpjs-selected-entities')).remove();
        // Try to select the first one to update the UI
        $(`${constants.DIALOG_SELECTOR} .warpjs-selected-entities li a`, instanceDoc).first().trigger('click');

        // Call server async
        Promise.resolve()
            .then(() => window.WarpJS.proxy.patch($, $(element).data('warpjsUrl'), {id, type, updatePath, patchAction}))
            .then(() => ChangeLogs.dirty())
            .catch((err) => {
                console.error("Error removing association", err);
                window.WarpJS.toast.error($, err.message, "Error removing association");
            })
        ;
    });
};
