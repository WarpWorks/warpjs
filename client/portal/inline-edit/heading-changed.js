const Promise = require('bluebird');
const warpjsUtils = require('@warp-works/warpjs-utils');

module.exports = ($, modal, changedElement) => {
        const url = modal.data('warpjsUrl');
        const id = $(changedElement).data('warpjsId');
        const newValue = $(changedElement).val();

        const data = {
            id,
            field: $(changedElement).data('warpjsField'),
            reference: {
                type: $(changedElement).data('warpjsReferenceType'),
                id: $(changedElement).data('warpjsReferenceId'),
                name: $(changedElement).data('warpjsReferenceName')
            },
            newValue,
        };

        Promise.resolve()
            .then(() => warpjsUtils.toast.loading($, "Saving..."))
            .then((toastLoading) => Promise.resolve()
                .then(() => warpjsUtils.proxy.patch($, url, data))
                .then(() => warpjsUtils.toast.success($, "Data updated"))
                .then(() => {
                    modal.data('warpjsIsDirty', true);
                    $(`.warpjs-document-elements .warpjs-list-item .warpjs-list-item-value[data-warpjs-id="${id}"]`, modal)
                        .data('warpjsName', newValue)
                        .text(newValue);
                })
                .catch((err) => warpjsUtils.toast.error($, err.message, "Failed"))
                .finally(() => warpjsUtils.toast.close($, toastLoading))
            )
        ;
};
