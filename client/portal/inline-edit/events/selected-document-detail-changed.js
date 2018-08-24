const Promise = require('bluebird');
const warpjsUtils = require('@warp-works/warpjs-utils');

module.exports = ($, modal, changedElement) => {
    const id = $(changedElement).data('warpjsId');
    const newValue = $(changedElement).val();

    console.log("data=", $(changedElement).data());

    return Promise.resolve()
        .then(() => warpjsUtils.toast.warning($, "Need to patch the association description", "TODO"))
        .then((res) => $(`.warpjs-section-selected-documents .warpjs-section-item[data-warpjs-id="${id}"]`, modal).data('warpjsDescription', newValue))
        .then(() => modal.data('warpjsIsDirty', true))
    ;
};
