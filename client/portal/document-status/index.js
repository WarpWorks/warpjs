const { CONTENT_PLACEHOLDER, modal } = window.WarpJS;

module.exports = ($, result) => {
    $(CONTENT_PLACEHOLDER).on('click', '.warpjs-document-status-container .warpjs-document-status-content .warpjs-content[data-warpjs-document-status-open-modal="true"] a[href="#"]', (event) => {
        event.stopPropagation();
        event.preventDefault();

        const warpjsContent = $(event.target).closest('.warpjs-content');
        const modalTitleKey = warpjsContent.data('warpjsDocumentStatusModalTitle');
        const modalContentKey = warpjsContent.data('warpjsDocumentStatusModalContent');

        const modalTitle = result.customMessages[modalTitleKey];
        const modalContent = result.customMessages[modalContentKey];

        const newModal = modal($, 'document-status', { html: true, value: modalTitle }, [
            { label: 'Close' }
        ]);
        $('> .modal-dialog > .modal-content > .modal-body', newModal).html(modalContent);
        newModal.modal('show');
    });
};
