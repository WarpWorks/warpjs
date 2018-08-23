const Promise = require('bluebird');
const warpjsUtils = require('@warp-works/warpjs-utils');

const constants = require('./constants');
const headingChanged = require('./heading-changed');
const itemsTemplate = require('./text-modal-elements.hbs');
const listItemValueClicked = require('./list-item-value-clicked');
const template = require('./text-modal.hbs');

function defineEvents($, modal) {
    modal.on('hidden.bs.modal', function() {
        if (modal.data('warpjsIsDirty')) {
            warpjsUtils.toast.loading($, "Data hase been updated, please reload the page", "Reload needed");
        }
    });

    modal.on('click', '.warpjs-document-elements .warpjs-content .warpjs-list-item .warpjs-list-item-value', function() {
        listItemValueClicked($, modal, this);
    });

    modal.on('change', '#warpjs-inline-edit-heading', function() {
        headingChanged($, modal, this);
    });
}

function updateModal($, element, res) {
    const elementType = $(element).data('warpjsType');
    const elementId = $(element).data('warpjsId');

    let modal = $(`[data-warpjs-modal="${constants.MODAL_NAME}"]`);
    if (!modal.length) {
        $('body').append(template({
            MODAL_NAME: constants.MODAL_NAME
        }));

        modal = $(`[data-warpjs-modal="${constants.MODAL_NAME}"]`);
        defineEvents($, modal);
    }

    const instance = res._embedded.instances[0];
    $('.warpjs-document-name > div > .warpjs-content', modal).text(instance.name);
    $('.warpjs-document-elements > div > .warpjs-content', modal).html(itemsTemplate({items: instance._embedded.items}));

    modal.modal('show');

    $(`.warpjs-list-item-value[data-warpjs-type="${elementType}"][data-warpjs-id="${elementId}"]`, modal).trigger('click');
    modal.data('warpjsUrl', res._links.self.href);
}

module.exports = ($, element) => {
    const elementType = $(element).data('warpjsType');
    const elementId = $(element).data('warpjsId');

    Promise.resolve()
        .then(() => warpjsUtils.toast.loading($, "Loading paragraphs...", "Loading"))
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
