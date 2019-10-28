const noDocumentsTemplate = require('./../selected-documents-none.hbs');

const { toast } = window.WarpJS;

module.exports = ($, modal, buttonClicked) => {
    const section = $(buttonClicked).closest('.warpjs-section');
    const data = {
        type: $(buttonClicked).data('warpjsType'),
        id: $(buttonClicked).data('warpjsId'),
        reference: {
            type: $(section).data('warpjsReferenceType'),
            id: $(section).data('warpjsReferenceId')
        }
    };

    const selectedDocument = $(`.warpjs-section-selected-documents .warpjs-section-item[data-warpjs-id="${data.id}"]`, modal);

    toast.warning($, "Remove selection on server", "TODO");

    try {
        selectedDocument.remove();
        if (!$('.warpjs-section-selected-documents .warpjs-section-item').length) {
            $('.warpjs-section-selected-documents', modal).append(noDocumentsTemplate());
        }
        $('.warpjs-section-selected-document-detail').html('');
    } catch (err) {
        toast.error($, err.message, "ERROR");
    }
};
