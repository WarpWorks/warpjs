const Promise = require('bluebird');
const warpjsUtils = require('@warp-works/warpjs-utils');

const openModal = require('./open-modal');

module.exports = ($, element) => {
    const elementType = $(element).data('warpjsType');
    const elementId = $(element).data('warpjsId');

    Promise.resolve()
        .then(() => warpjsUtils.toast.loading($, "Loading data...", "Loading"))
        .then((toastLoading) => Promise.resolve()
            .then(() => warpjsUtils.proxy.post($, $(element).data('warpjsUrl'), { elementType, elementId }))
            .then((res) => openModal($, element, res))
            .catch((err) => {
                console.error("Error:", err);
                warpjsUtils.toast.error($, err.message, "Error getting data");
            })
            .finally(() => warpjsUtils.toast.close($, toastLoading))
        )
    ;
};
