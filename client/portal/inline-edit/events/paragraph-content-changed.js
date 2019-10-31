const Promise = require('bluebird');

const ChangeLogs = require('./../change-logs');
const constants = require('./../constants');

module.exports = ($, modal, changedElement) => {
    const { proxy, toast } = window.WarpJS;

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
        newValue
    };

    Promise.resolve()
        .then(() => toast.loading($, "Saving..."))
        .then((toastLoading) => Promise.resolve()
            .then(() => proxy.patch($, url, data))
            .then(() => toast.success($, "Data updated"))
            .then(() => {
                constants.setDirty();
                ChangeLogs.dirty();
                $(`.warpjs-document-elements .warpjs-list-item .warpjs-list-item-value[data-warpjs-id="${id}"]`, modal)
                    .data('warpjsDescription', newValue)
                ;
            })
            .catch((err) => toast.error($, err.message, "Failed"))
            .finally(() => toast.close($, toastLoading))
        )
    ;
};
