const Promise = require('bluebird');
const warpjsUtils = require('@warp-works/warpjs-utils');

const constants = require('./constants');
const template = require('./text-modal.hbs');
const itemsTemplate = require('./text-modal-elements.hbs');
const detailTemplate = require('./text-modal-detail.hbs');

function defineEvents($, modal) {
    modal.on('click', '.warpjs-document-elements .warpjs-content .warpjs-list-item .warpjs-list-item-value', function() {
        $(this).closest('.warpjs-document-elements').find('.warpjs-list-item').removeClass('warpjs-list-item-selected');
        $(this).closest('.warpjs-list-item').addClass('warpjs-list-item-selected');

        const item = {
            type: $(this).data('warpjsType'),
            id: $(this).data('warpjsId'),
            position: $(this).data('warpjsPosition'),
            name: $(this).data('warpjsName'),
            description: $(this).data('warpjsDescription'),
            reference: {
                type: $(this).data('warpjsReferenceType'),
                id: $(this).data('warpjsReferenceId'),
                name: $(this).data('warpjsReferenceName')
            },
            canChangeName: $(this).data('warpjsReferenceType') === 'Relationship'
        };

        $('.warpjs-detail-container .warpjs-placeholder', modal).html(detailTemplate({item}));
    });

    modal.on('change', '#warpjs-inline-edit-heading, #warpjs-inline-edit-content', function() {
        const url = modal.data('warpjsUrl');
        const data = {
            id: $(this).data('warpjsId'),
            field: $(this).data('warpjsField'),
            reference: {
                type: $(this).data('warpjsReferenceType'),
                id: $(this).data('warpjsReferenceId'),
                name: $(this).data('warpjsReferenceName')
            },
            newValue: $(this).val()
        };

        Promise.resolve()
            .then(() => warpjsUtils.toast.loading($, "Saving..."))
            .then((toastLoading) => Promise.resolve()
                .then(() => warpjsUtils.proxy.patch($, url, data))
                .then(() => warpjsUtils.toast.success($, "Data updated"))
                .catch((err) => warpjsUtils.toast.error($, err.message, "Failed"))
                .finally(() => warpjsUtils.toast.close($, toastLoading))
            )
        ;
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

    return Promise.resolve()
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
