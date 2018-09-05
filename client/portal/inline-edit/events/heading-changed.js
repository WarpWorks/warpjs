const Promise = require('bluebird');
const warpjsUtils = require('@warp-works/warpjs-utils');

module.exports = ($, modal, changedElement) => {
    const url = modal.data('warpjsUrl');
    const id = $(changedElement).data('warpjsId');
    const newValue = $(changedElement).val().trim();

    const data = {
        id,
        field: $(changedElement).data('warpjsField'),
        reference: {
            type: $(changedElement).data('warpjsReferenceType'),
            id: $(changedElement).data('warpjsReferenceId'),
            name: $(changedElement).data('warpjsReferenceName')
        },
        newValue
    };

    Promise.resolve()
        .then(() => warpjsUtils.toast.loading($, "Saving..."))
        .then((toastLoading) => Promise.resolve()
            .then(() => warpjsUtils.proxy.patch($, url, data))
            .then(() => warpjsUtils.toast.success($, "Data updated"))
            .then(() => {
                modal.data('warpjsIsDirty', true);
                const listItemValue = $(`.warpjs-document-elements .warpjs-list-item .warpjs-list-item-value[data-warpjs-id="${id}"]`, modal);

                if (newValue) {
                    listItemValue.removeClass('warpjs-list-item-value-untitled').data('warpjsName', newValue).text(newValue);
                } else {
                    listItemValue.addClass('warpjs-list-item-value-untitled').data('warpjsName', newValue).text('untitled');
                }
            })
            .catch((err) => warpjsUtils.toast.error($, err.message, "Failed"))
            .finally(() => warpjsUtils.toast.close($, toastLoading))
        )
    ;
};
