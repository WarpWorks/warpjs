module.exports = ($, result) => {
    $(window.WarpJS.CONTENT_PLACEHOLDER).on('click', '.warpjs-document-status-container .warpjs-document-status-content .warpjs-content[data-warpjs-document-status-open-modal="true"] a[href="#"]', (event) => {
        event.stopPropagation();
        event.preventDefault();

        const warpjsContent = $(event.target).closest('.warpjs-content');
        const modalTitleKey = warpjsContent.data('warpjsDocumentStatusModalTitle');
        const modalContentKey = warpjsContent.data('warpjsDocumentStatusModalContent');

        const modalTitle = result.customMessages[modalTitleKey];
        const modalContent = result.customMessages[modalContentKey];

        const modal = window.WarpJS.modal($, 'document-status', { html: true, value: modalTitle }, [
            { label: 'Close' }
        ]);
        $('> .modal-dialog > .modal-content > .modal-body', modal).html(modalContent);
        modal.modal('show');
    });
};
