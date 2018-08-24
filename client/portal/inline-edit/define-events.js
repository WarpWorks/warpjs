const warpjsUtils = require('@warp-works/warpjs-utils');

const headingChanged = require('./heading-changed');
const listItemValueClicked = require('./list-item-value-clicked');
const selectedDocumentDetailChanged = require('./events/selected-document-detail-changed');
const selectedDocumentsItemClicked = require('./events/selected-documents-item-clicked');

module.exports = ($, modal) => {
    modal.on('hidden.bs.modal', function() {
        if (modal.data('warpjsIsDirty')) {
            warpjsUtils.toast.loading($, "Data has been updated, please reload the page", "Reload needed");
        }
    });

    modal.on('click', '.warpjs-document-elements .warpjs-content .warpjs-list-item .warpjs-list-item-value', function() {
        listItemValueClicked($, modal, this);
    });

    modal.on('change', '#warpjs-inline-edit-heading', function() {
        headingChanged($, modal, this);
    });

    modal.on('click', '.warpjs-section-selected-documents .warpjs-section-item', function () {
        selectedDocumentsItemClicked($, modal, this);
    });

    modal.on('change', '#warpjs-inline-edit-selected-document-detail', function() {
        selectedDocumentDetailChanged($, modal, this);
    });
};
