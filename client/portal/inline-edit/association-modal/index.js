const constants = require('./../constants');

module.exports = async ($, element) => {
    const data = {
        elementType: $(element).data('warpjsType'),
        elementId: $(element).data('warpjsId'),
        reference: {
            type: $(element).data('warpjsReferenceType'),
            id: $(element).data('warpjsReferenceId')
        }
    };

    const toastLoading = window.WarpJS.toast.loading($, "Loading data...", "Loading");
    try {
        const res = await window.WarpJS.proxy.post($, $(element).data('warpjsUrl'), data);
        console.log("associationModal(): res=", res);

        const state = window.WarpJS.flattenHAL(res);
        console.log("state=", state);

        const modal = window.WarpJS.bareModal($, constants.MODAL_NAME);
        modal.on('hidden.bs.modal', () => {
            modal.remove();
        });

        modal.modal('show');
    } catch (err) {
        console.error("Error:", err);
        window.WarpJS.toast.error($, err.message, "Error getting data");
    } finally {
        window.WarpJS.toast.close($, toastLoading);
    }
};
