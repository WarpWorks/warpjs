const Promise = require('bluebird');
const { proxy, toast } = require('@warp-works/warpjs-utils');

const constants = require('./constants');
const formFeedback = require('./../../form-feedback');

module.exports = ($, instanceDoc) => {
    instanceDoc.on('change', `${constants.DIALOG_SELECTOR} textarea.warpjs-relationship-description`, function() {
        const updatePath = $(this).data('warpjsDocLevel');
        const updateValue = $(this).val();

        $(`li[data-warpjs-doc-level="${updatePath}"]`, instanceDoc).data('warpjsRelationshipDescription', updateValue);

        return Promise.resolve()
            .then(() => formFeedback.start($, this))
            .then(() => proxy.patch($, undefined, { updatePath, updateValue }))
            .then(() => formFeedback.success($, this))
            .catch((err) => {
                formFeedback.error($, this);
                console.error("Error updating association description:", err);
                toast.error($, err.message, "Error updating association description");
            })
        ;
    });
};
