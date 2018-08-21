const Promise = require('bluebird');
const warpjsUtils = require('@warp-works/warpjs-utils');

const constants = require('./constants');
const template = require('./text-modal.hbs');

module.exports = ($, element) => Promise.resolve()
    .then(() => warpjsUtils.toast.loading($, "Loading paragraphs...", "Loading"))
    .then((toastLoading) => Promise.resolve()
        .then(() => warpjsUtils.proxy.post($, $(element).data('warpjsUrl'), {
            elementType: $(element).data('warpjsType'),
            elementId: $(element).data('warpjsId')
        }))
        .then((res) => {
            let modal = $(`[data-warpjs-modal="${constants.MODAL_NAME}"]`);
            if (!modal.length) {
                $('body').append(template({
                    MODAL_NAME: constants.MODAL_NAME
                }));

                modal = $(`[data-warpjs-modal="${constants.MODAL_NAME}"]`);
            }
            modal.modal('show');
        })
        .catch((err) => {
            console.error("Error:", err);
            warpjsUtils.toast.error($, err.message, "Error getting data");
        })
        .finally(() => warpjsUtils.toast.close($, toastLoading))
    )
;
