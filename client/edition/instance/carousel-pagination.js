const Promise = require('bluebird');

const deleteConfirm = require('./../delete-confirm');

function findTopEmbedded(element) {
    return $(element).parents('[data-warpjs-entity-type="Embedded"]').last();
}

module.exports = ($, instanceDoc) => {
    // When a carousel drop-down is changed, move to that pane-body.
    instanceDoc.on('change', '.carousel-pagination .pagination-select', function() {
        const tabindex = $(this).val();
        $(this).closest('.panel-heading').next().children().addClass('hidden');
        $(this).closest('.panel-heading').next().children(`[data-option-index="${tabindex}"]`).removeClass('hidden');
        $(this).closest('.pagination-group')
            .children('.pagination-info')
            .children('.pagination-info-start')
            .text(parseInt($(this).val(), 10) + 1);
    });

    instanceDoc.on('click', '.carousel-pagination .pagination-left, .carousel-pagination .pagination-right', function() {
        const parent = $(this).closest('.pagination-group');
        const select = $('> .pagination-select', parent);
        const selectValue = parseInt(select.val(), 10);
        const pageLimit = parseInt($(this).data('pageLimit'), 10);

        if (selectValue !== pageLimit) {
            const delta = ($(this).data('pageDirection') === 'right') ? 1 : -1;
            const newIndex = selectValue + delta;
            select.val(newIndex).trigger('change');
        }
    });

    instanceDoc.on('click', '.carousel-pagination .pagination-add .glyphicon.pagination-add:not([disabled])', function(e) {
        e.preventDefault();
        e.stopPropagation();

        const url = $(this).data('warpjsUrl') ? $(this).data('warpjsUrl') : findTopEmbedded(this).data('warpjsUrl');
        const data = {
            action: $(this).data('warpjsAction'),
            docLevel: $(this).data('warpjsDocLevel')
        };

        return Promise.resolve()
            .then(() => window.WarpJS.toast.loading($, "This can take few seconds. Page will reload when done", "Creating..."))
            .then((toastLoading) => Promise.resolve()
                .then(() => window.WarpJS.proxy.post($, url, data))
                .then(() => document.location.reload())
                .catch((err) => {
                    console.error("Error adding carousel:", err);
                    window.WarpJS.toast.close($, toastLoading);
                    window.WarpJS.toast.error($, err.message, "Error adding child document");
                })
            )
        ;
    });

    instanceDoc.on('click', '.carousel-pagination .pagination-remove .glyphicon.pagination-remove:not([disabled])', function(e) {
        e.preventDefault();
        e.stopPropagation();

        const parent = $(this).closest('.pagination-group');
        const select = $('> .pagination-select', parent);
        const option = $('option:selected', select);

        if (option.length) {
            const topEmbedded = findTopEmbedded(this);
            const url = topEmbedded.data('warpjsUrl');
            const data = {
                docLevel: $(option).data('warpjsDocLevel')
            };

            Promise.resolve()
                .then(() => deleteConfirm($, this))
                .then((confirmed) => {
                    if (confirmed) {
                        Promise.resolve()
                            .then(() => window.WarpJS.toast.loading($, "This can take few seconds. Page will reload when done", "Deleting..."))
                            .then((toastLoading) => Promise.resolve()
                                .then(() => window.WarpJS.proxy.del($, url, data))
                                .then((res) => document.location.reload())
                                .catch((err) => {
                                    console.error("Error removing carousel:", err);
                                    window.WarpJS.toast.close($, toastLoading);
                                    window.WarpJS.toast.error($, err.message, "Error removing child document");
                                })
                            )
                        ;
                    }
                })
            ;
        }
    });
};
