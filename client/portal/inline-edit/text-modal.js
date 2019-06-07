const openModal = require('./open-modal');

module.exports = async ($, element) => {
    const data = {
        elementType: $(element).data('warpjsType'),
        elementId: $(element).data('warpjsId'),
        reference: {
            type: $(element).data('warpjsReferenceType'),
            id: $(element).data('warpjsReferenceId')
        }
    };

    const toastLoading = await window.WarpJS.toast.loading($, "Loading data...", "Loading");
    try {
        const res = await window.WarpJS.proxy.post($, $(element).data('warpjsUrl'), data);
        await openModal($, element, res);
    } catch (err) {
        console.error("Error:", err);
        await window.WarpJS.toast.error($, err.message, "Error getting data");
    } finally {
        await window.WarpJS.toast.close($, toastLoading);
    }
};
