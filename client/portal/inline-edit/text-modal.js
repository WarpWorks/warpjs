const openModal = require('./open-modal');

module.exports = async ($, element) => {
    const { proxy, toast } = window.WarpJS;

    const data = {
        elementType: $(element).data('warpjsType'),
        elementId: $(element).data('warpjsId'),
        reference: {
            type: $(element).data('warpjsReferenceType'),
            id: $(element).data('warpjsReferenceId')
        }
    };

    const toastLoading = await toast.loading($, "Loading data...", "Loading");
    try {
        const res = await proxy.post($, $(element).data('warpjsUrl'), data);
        await openModal($, element, res);
    } catch (err) {
        console.error("Error:", err);
        await toast.error($, err.message, "Error getting data");
    } finally {
        await toast.close($, toastLoading);
    }
};
