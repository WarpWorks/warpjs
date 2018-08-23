const Promise = require('bluebird');
const warpjsUtils = require('@warp-works/warpjs-utils');

function updateModal($, element, res) {
    warpjsUtils.toast.warning($, "Handle associations res", "TODO");
}

module.exports = ($, element) => {
    const elementType = $(element).data('warpjsType');
    const elementId = $(element).data('warpjsId');

    Promise.resolve()
        .then(() => warpjsUtils.toast.loading($, "Loading associations...", "Loading"))
        .then((toastLoading) => Promise.resolve()
            .then(() => warpjsUtils.proxy.post($, $(element).data('warpjsUrl'), { elementType, elementId }))
            .then((res) => updateModal($, element, res))
            .catch((err) => {
                console.error("Error:", err);
                warpjsUtils.toast.error($, err.message, "Error getting data");
            })
            .finally(() => warpjsUtils.toast.close($, toastLoading))
        )
    ;
};
