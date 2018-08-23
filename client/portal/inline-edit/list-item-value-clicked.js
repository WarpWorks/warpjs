const associationTemplate = require('./association.hbs');
const detailTemplate = require('./text-modal-detail.hbs');

module.exports = ($, modal, clickedElement) => {
        $(clickedElement).closest('.warpjs-document-elements').find('.warpjs-list-item').removeClass('warpjs-list-item-selected');
        $(clickedElement).closest('.warpjs-list-item').addClass('warpjs-list-item-selected');

        const isParagraph = $(clickedElement).data('warpjsType') === 'Paragraph';

        const item = {
            type: $(clickedElement).data('warpjsType'),
            id: $(clickedElement).data('warpjsId'),
            position: $(clickedElement).data('warpjsPosition'),
            name: $(clickedElement).data('warpjsName'),
            description: $(clickedElement).data('warpjsDescription'),
            reference: {
                type: $(clickedElement).data('warpjsReferenceType'),
                id: $(clickedElement).data('warpjsReferenceId'),
                name: $(clickedElement).data('warpjsReferenceName')
            },
            canChangeName: isParagraph && $(clickedElement).data('warpjsReferenceType') === 'Relationship'
        };

        if (isParagraph) {
            $('.warpjs-detail-container .warpjs-placeholder', modal).html(detailTemplate({item}));
        } else {
            $('.warpjs-detail-container .warpjs-placeholder', modal).html(associationTemplate({item}));
        }
};
