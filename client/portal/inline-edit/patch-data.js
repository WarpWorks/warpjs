const Promise = require('bluebird');
const warpjsUtils = require('@warp-works/warpjs-utils');

module.exports = ($, modal, element) => Promise.resolve()
    .then(() => warpjsUtils.toast.loading($, "Saving..."))
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
        .then((data) => warpjsUtils.proxy.patch($, modal.data('warpjsUrl'), data))
        .then(() => warpjsUtils.toast.success($, "Data updated"))
        .then(() => modal.data('warpjsIsDirty', true))
        .then(() => true)

        .catch((err) => warpjsUtils.toast.error($, err.message, "Failed"))
        .finally(() => warpjsUtils.toast.close($, toastLoading))
    )
;
