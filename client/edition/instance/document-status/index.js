const constants = require('./constants');

const { CONTENT_PLACEHOLDER, modal } = window.WarpJS;

module.exports = ($, instanceDoc) => {
    $('select[data-doc-level="Enum:Status"]', instanceDoc).on('change', function() {
        const statusValue = $(this).val();
        $(constants.PLACEHOLDER, instanceDoc).removeClass(function(index, className) {
            return className.split(' ').filter((aClass) => aClass.indexOf(`${constants.BASE_CLASS}-`) === 0).join(" ");
        });
        $(constants.PLACEHOLDER, instanceDoc).addClass(`${constants.BASE_CLASS}-${statusValue}`);
        $(constants.PLACEHOLDER, instanceDoc).text(statusValue);
    });

    $(constants.PLACEHOLDER, instanceDoc).on('click', function() {
        const customMessages = $(CONTENT_PLACEHOLDER).data('customMessages');

        const modalTitle = customMessages.ContentDocumentStatusModalTitle;
        const modalContent = customMessages.ContentDocumentStatusModalContent;

        const newModal = modal($, constants.IDENTIFIER, modalTitle, [
            { label: 'Close' }
        ]);
        $('> .modal-dialog > .modal-content > .modal-body', newModal).html(modalContent);

        newModal.modal('show');
    });
};
