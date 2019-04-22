const ChangeLogs = require('./change-logs');
const constants = require('./constants');
const defineEvents = require('./define-events');
const itemsTemplate = require('./text-modal-elements.hbs');
const template = require('./text-modal.hbs');

module.exports = ($, element, res) => {
    const elementType = $(element).data('warpjsType');
    const elementId = $(element).data('warpjsId');
    let modal = $(`[data-warpjs-modal="${constants.MODAL_NAME}"]`);
    const instance = res._embedded.instances[0];
    const items = instance._embedded ? instance._embedded.items : [];
    $.each(items, (index, item) => {
        item.position = index;
    });
    if (!modal.length) {
        $('body').append(template({
            MODAL_NAME: constants.MODAL_NAME,
            EDIT_URL: $(element).data('warpjsAdvancedEditUrl'),
            res: res
        }));

        modal = $(`[data-warpjs-modal="${constants.MODAL_NAME}"]`);
        $(modal).data('aggregations', res._embedded.aggregations);
        defineEvents($, modal, items);
    }

    $('.warpjs-document-name > div > .warpjs-content', modal).text(instance.name);
    $.each(items, (index, item) => {
        const images = item._embedded ? item._embedded.images : [];
        item.images = JSON.stringify(images);
    });

    $('.warpjs-document-elements > div > .warpjs-content', modal).html(itemsTemplate({items: items}));

    modal.modal('show');
    $(`.warpjs-list-item-value[data-warpjs-type="${elementType}"][data-warpjs-id="${elementId}"]`, modal).trigger('click');
    modal.data('warpjsUrl', res._links.self.href);

    const instanceDoc = $('[data-warpjs-status="instance"]');
    ChangeLogs.init($, res, instanceDoc, element);
};
