const Promise = require('bluebird');

const openBasicPropertyModal = require('./open-basic-property-modal');

module.exports = ($, element) => {
    const data = {
        elementType: $(element).data('warpjsType'),
        elementId: $(element).data('warpjsId'),
        reference: {
            type: $(element).data('warpjsReferenceType'),
            id: $(element).data('warpjsReferenceId')
        }
    };

    Promise.resolve()
        .then(() => window.WarpJS.toast.loading($, "Loading data...", "Loading"))
        .then((toastLoading) => Promise.resolve()
            .then(() => window.WarpJS.proxy.post($, $(element).data('warpjsUrl'), data))
            .then((res) => openBasicPropertyModal($, element, res))
            .catch((err) => {
                console.error("Error:", err);
                window.WarpJS.toast.error($, err.message, "Error getting data");
            })
            .finally(() => window.WarpJS.toast.close($, toastLoading))
        )
    ;
};
