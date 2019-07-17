const ChangeLogs = require('./../change-logs');
const constants = require('./../constants');
const detailTemplate = require('./basic-property-detail.hbs');
const initializeWysiwyg = require('./../initialize-wysiwyg');
const paragraphContentChanged = require('./../events/paragraph-content-changed');
const template = require('./basic-property-modal.hbs');

module.exports = ($, element, res) => {
    const elementType = $(element).data('warpjsType');
    const elementId = $(element).data('warpjsId');
    let modal = $(`[data-warpjs-modal="${constants.MODAL_NAME}"]`);
    const instance = res._embedded.instances[0];

    if (!modal.length) {
        $('body').append(template({
            MODAL_NAME: constants.MODAL_NAME,
            EDIT_URL: $(element).data('warpjsAdvancedEditUrl'),
            res: res
        }));

        modal = $(`[data-warpjs-modal="${constants.MODAL_NAME}"]`);
    }

    $('.warpjs-document-name > div > .warpjs-content', modal).text(instance.name);
    modal.modal('show');
    $(`.warpjs-list-item-value[data-warpjs-type="${elementType}"][data-warpjs-id="${elementId}"]`, modal).trigger('click');

    $('.warpjs-detail-container .warpjs-placeholder', modal).html(detailTemplate({ item: res._embedded.instances[0]._embedded.basicProperties[0] }));
    initializeWysiwyg($, modal, 'test');

    modal.data('warpjsUrl', res._links.self.href);
    const instanceDoc = $('[data-warpjs-status="instance"]');
    ChangeLogs.init($, res, instanceDoc, element);

    modal.on('change', '#warpjs-inline-edit-content', function() {
        paragraphContentChanged($, modal, this);
    });
};
