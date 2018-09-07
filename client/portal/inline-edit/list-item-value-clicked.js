const associationTemplate = require('./association.hbs');
const detailTemplate = require('./text-modal-detail.hbs');
const initializeWysiwyg = require('./initialize-wysiwyg');
const updateTypes = require('./update-types');

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
        item.isHeadingLevel = {
            H1: $(clickedElement).data('warpjsLevel') === 'H1',
            H2: $(clickedElement).data('warpjsLevel') === 'H2',
            H3: $(clickedElement).data('warpjsLevel') === 'H3',
            H4: $(clickedElement).data('warpjsLevel') === 'H4',
            H5: $(clickedElement).data('warpjsLevel') === 'H5',
            H6: $(clickedElement).data('warpjsLevel') === 'H6'
        };

        $('.warpjs-detail-container .warpjs-placeholder', modal).html(detailTemplate({item}));
        initializeWysiwyg($, modal, clickedElement);
    } else {
        $('.warpjs-detail-container .warpjs-placeholder', modal).html(associationTemplate({item}));
        updateTypes($, modal, clickedElement);
    }
};
