const Promise = require('bluebird');
const { proxy, toast } = require('@warp-works/warpjs-utils');

const constants = require('./../constants');
const formFeedback = require('./../../form-feedback');


module.exports = ($, instanceDoc) => {
    const selector = `${constants.DIALOG_SELECTOR} #warpjs-association-modal-selected-position`;

    instanceDoc.on('change', selector, function() {
        const data = {
            updatePath: $(this).data('warpjsDocLevel'),
            field: $(this).data('warpjsField'),
            updateValue: $(this).val()
        };

        $(`li[data-warpjs-doc-level="${data.updatePath}"]`, instanceDoc).data('warpjsRelationshipPosition', data.updateValue);

        return Promise.resolve()
            .then(() => formFeedback.start($, this))
            .then(() => proxy.patch($, undefined, data))
            .then(() => formFeedback.success($, this))
            .catch((err) => {
                formFeedback.error($, this);
                console.error("Error updating association position:", err);
                toast.error($, err.message, "Error updating association position");
            })
        ;
    })
};
