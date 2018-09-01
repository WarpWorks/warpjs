const selectedDocumentDetailTemplate = require('./../selected-document-detail/template.hbs');

module.exports = ($, modal, clickedElement) => {
    $(clickedElement).closest('.warpjs-section').find('.warpjs-section-item').removeClass('warpjs-section-selected-item');
    $(clickedElement).addClass('warpjs-section-selected-item');

    const data = {
        type: $(clickedElement).data('warpjsType'),
        id: $(clickedElement).data('warpjsId'),
        name: $(clickedElement).data('warpjsName'),
        description: $(clickedElement).data('warpjsDescription')
    };

    $('.warpjs-section-selected-document-detail', modal).html(selectedDocumentDetailTemplate(data));
};
