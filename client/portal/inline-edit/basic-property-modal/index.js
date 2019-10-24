const Promise = require('bluebird');

const openBasicPropertyModal = require('./open-basic-property-modal');

const { proxy, toast } = window.WarpJS;

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
        .then(() => toast.loading($, "Loading data...", "Loading"))
        .then((toastLoading) => Promise.resolve()
            .then(() => proxy.post($, $(element).data('warpjsUrl'), data))
            .then((res) => openBasicPropertyModal($, element, res))
            .catch((err) => {
                console.error("Error:", err);
                toast.error($, err.message, "Error getting data");
            })
            .finally(() => toast.close($, toastLoading))
        )
    ;
};
