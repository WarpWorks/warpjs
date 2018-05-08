const Promise = require('bluebird');
const warpjsUtils = require('@warp-works/warpjs-utils');

const constants = require('./constants');
const formFeedback = require('./../../form-feedback');
const patch = require('./../../../patch');

module.exports = ($, instanceDoc) => {
    instanceDoc.on('change', `${constants.DIALOG_SELECTOR} textarea.warpjs-relationship-description`, function() {
        const docLevel = $(this).data('warpjsDocLevel');
        const newValue = $(this).val();

        $(`li[data-warpjs-doc-level="${docLevel}"]`, instanceDoc).data('warpjsRelationshipDescription', newValue);

        return Promise.resolve()
            .then(() => formFeedback.start($, this))
            .then(() => patch($, docLevel, newValue))
            .then(() => formFeedback.success($, this))
            .catch((err) => {
                formFeedback.error($, this);
                console.error("Error updating association description:", err);
                warpjsUtils.toast.error($, err.message, "Error updating association description");
            })
        ;
    });
};
