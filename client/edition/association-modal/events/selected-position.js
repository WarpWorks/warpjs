const Promise = require('bluebird');

const constants = require('./../constants');
const formFeedback = require('./../../form-feedback');

module.exports = ($, instanceDoc) => {
    const { proxy, byPositionThenName, toast } = window.WarpJS;

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

            // Reposition the selected in the modal.
            .then(() => $(`${constants.DIALOG_SELECTOR} .${constants.SELECTED_ENTITIES}`, instanceDoc))
            .then((section) => Promise.resolve()
                .then(() => section.children('li').get())
                .then((items) => items.map((item) => ({
                    name: $(item).data('warpjsDisplayName'),
                    position: $(item).data('warpjsRelationshipPosition'),
                    item
                })))
                .then((items) => items.sort(byPositionThenName))
                .then((items) => items.map((item) => item.item))
                .then((items) => items.forEach((item) => section.append(item)))
            )

            // Resort CSV list
            .then(() => $(constants.DIALOG_SELECTOR).data(constants.CURRENT_ELEMENT_KEY))
            .then((currentElement) => $(currentElement).closest(`.${constants.SELECTED_ENTITIES}`))
            .then((section) => Promise.resolve()
                .then(() => section.children('.warpjs-selected-item').get())
                .then((items) => items.map((item) => ({
                    name: $(item).data('warpjsDisplayName'),
                    position: $(item).data('warpjsRelationshipPosition'),
                    item
                })))
                .then((items) => items.sort(byPositionThenName))
                .then((items) => items.map((item) => item.item))
                .then((items) => items.forEach((item) => section.append(item)))
            )

            .catch((err) => {
                formFeedback.error($, this);
                console.error("Error updating association position:", err);
                toast.error($, err.message, "Error updating association position");
            })
        ;
    });
};
