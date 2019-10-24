const Promise = require('bluebird');

const constants = require('./constants');

const { proxy, toast } = window.WarpJS;

module.exports = ($, modal, element) => Promise.resolve()
    .then(() => toast.loading($, "Saving..."))
    .then((toastLoading) => Promise.resolve()
        .then(() => ({
            id: $(element).data('warpjsId'),
            field: $(element).data('warpjsField'),
            reference: {
                type: $(element).data('warpjsReferenceType'),
                id: $(element).data('warpjsReferenceId'),
                name: $(element).data('warpjsReferenceName')
            },
            newValue: $(element).val().trim()
        }))
        .then((data) => proxy.patch($, modal.data('warpjsUrl'), data))
        .then(() => toast.success($, "Data updated"))
        .then(() => constants.setDirty())
        .then(() => true)

        .catch((err) => toast.error($, err.message, "Failed"))
        .finally(() => toast.close($, toastLoading))
    )
;
