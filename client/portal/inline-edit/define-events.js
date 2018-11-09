const Promise = require('bluebird');

const addDocumentToSelection = require('./events/add-document-to-selection');
const addParagraph = require('./events/add-paragraph');
const deleteClicked = require('./events/delete-clicked');
const listItemValueClicked = require('./list-item-value-clicked');
const paragraphContentChanged = require('./events/paragraph-content-changed');
const removeFromSelectionClicked = require('./events/remove-from-selection-clicked');
const selectedDocumentDetailChanged = require('./events/selected-document-detail-changed');
const selectedDocumentsItemClicked = require('./events/selected-documents-item-clicked');
const movePosition = require('./events/move-position');
const textModalEvents = require('./text-modal/events');

module.exports = ($, modal, items) => {
    modal.on('hidden.bs.modal', function() {
        if (modal.data('warpjsIsDirty')) {
            window.WarpJS.toast.loading($, "Data has been updated, please reload the page", "Reload needed");
        }
    });

    modal.on('click', '.warpjs-document-elements .warpjs-content .warpjs-list-item .warpjs-list-item-value', function() {
        listItemValueClicked($, modal, this);
    });

    modal.on('change', '#warpjs-inline-edit-content', function() {
        paragraphContentChanged($, modal, this);
    });

    modal.on('click', '.warpjs-section-selected-documents .warpjs-section-item', function() {
        selectedDocumentsItemClicked($, modal, this);
    });

    modal.on('change', '#warpjs-inline-edit-selected-document-detail', function() {
        selectedDocumentDetailChanged($, modal, this);
    });

    modal.on('click', '#warpjs-inline-edit-delete-button', function() {
        removeFromSelectionClicked($, modal, this);
    });

    modal.on('click', '.warpjs-section-type-documents .warpjs-section-item', function() {
        addDocumentToSelection($, modal, this);
    });

    modal.on('click', '.warpjs-modal-advanced-edit', function() {
        document.location.href = $(this).data('warpjsUrl');
    });

    modal.on('click', '[data-warpjs-action="inline-edit-paragraph-move-to-first"]', (event) => {
        movePosition($, modal, event, items, 'first');
    });

    modal.on('click', '[data-warpjs-action="inline-edit-paragraph-move-up"]', (event) => {
        movePosition($, modal, event, items, -1);
    });

    modal.on('click', '[data-warpjs-action="inline-edit-paragraph-move-down"]', (event) => {
        movePosition($, modal, event, items, 1);
    });

    modal.on('click', '[data-warpjs-action="inline-edit-paragraph-move-to-last"]', (event) => {
        movePosition($, modal, event, items, 'last');
    });

    modal.on('click', '[data-warpjs-action="inline-edit-delete"]', (event) => Promise.resolve()
        .then(() => deleteClicked($, modal, event, items))
        .then((updatedItems) => {
            items = updatedItems;
        })
    );
    modal.on('click', '.warpjs-list-item-add', (event) => Promise.resolve()
        .then(() => addParagraph($, modal, event, items))
    );

    //fix second modal appearing behind first
    $(document).on('show.bs.modal', '.modal', function () {
        var zIndex = 1040 + (10 * $('.modal:visible').length);
        $(this).css('z-index', zIndex);
        setTimeout(function() {
            $('.modal-backdrop').not('.modal-stack').css('z-index', zIndex - 1).addClass('modal-stack');
        }, 0);
    });

    textModalEvents($, modal);
};
