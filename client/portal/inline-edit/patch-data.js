const Promise = require('bluebird');

const constants = require('./constants');

module.exports = ($, modal, element) => Promise.resolve()
    .then(() => window.WarpJS.toast.loading($, "Saving..."))
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
        .then((data) => window.WarpJS.proxy.patch($, modal.data('warpjsUrl'), data))
        .then(() => window.WarpJS.toast.success($, "Data updated"))
        .then(() => constants.setDirty())
        .then(() => true)

        .catch((err) => window.WarpJS.toast.error($, err.message, "Failed"))
        .finally(() => window.WarpJS.toast.close($, toastLoading))
    )
;
