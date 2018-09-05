const constants = require('./constants');
const defineEvents = require('./define-events');
const itemsTemplate = require('./text-modal-elements.hbs');
const template = require('./text-modal.hbs');

module.exports = ($, element, res) => {
    const elementType = $(element).data('warpjsType');
    const elementId = $(element).data('warpjsId');

    let modal = $(`[data-warpjs-modal="${constants.MODAL_NAME}"]`);
    if (!modal.length) {
        $('body').append(template({
            MODAL_NAME: constants.MODAL_NAME,
            EDIT_URL: $(element).data('warpjsAdvancedEditUrl')
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
};
