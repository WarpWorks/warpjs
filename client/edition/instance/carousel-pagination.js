import deleteConfirm from './../delete-confirm';

// import _debug from './debug'; const debug = _debug('carousel-pagination');

const findTopEmbedded = (element) => $(element).parents('[data-warpjs-entity-type="Embedded"]').last();

module.exports = ($, instanceDoc) => {
    const { proxy, toast } = window.WarpJS;

    // When a carousel drop-down is changed, move to that pane-body.
    instanceDoc.on('change', '.carousel-pagination .pagination-select', (e) => {
        const tabindex = $(e.target).val();
        $(e.target).closest('.panel-heading').next().children().addClass('hidden');
        $(e.target).closest('.panel-heading').next().children(`[data-option-index="${tabindex}"]`).removeClass('hidden');
        $(e.target).closest('.pagination-group')
            .children('.pagination-info')
            .children('.pagination-info-start')
            .text(parseInt($(e.target).val(), 10) + 1);
    });

    instanceDoc.on('click', '.carousel-pagination .pagination-left, .carousel-pagination .pagination-right', (e) => {
        const parent = $(e.target).closest('.pagination-group');
        const select = $('> .pagination-select', parent);
        const selectValue = parseInt(select.val(), 10);
        const pageLimit = parseInt($(e.target).data('pageLimit'), 10);

        if (selectValue !== pageLimit) {
            const delta = ($(e.target).data('pageDirection') === 'right') ? 1 : -1;
            const newIndex = selectValue + delta;
            select.val(newIndex).trigger('change');
        }
    });

    instanceDoc.on('click', '.carousel-pagination .pagination-add .glyphicon.pagination-add:not([disabled])', async (e) => {
        e.preventDefault();
        e.stopPropagation();

        const url = $(e.target).data('warpjsUrl') ? $(e.target).data('warpjsUrl') : findTopEmbedded(e.target).data('warpjsUrl');
        const data = {
            action: $(e.target).data('warpjsAction'),
            docLevel: $(e.target).data('warpjsDocLevel')
        };

        const toastLoading = toast.loading($, "This can take few seconds. Page will reload when done", "Creating...");
        try {
            await proxy.post($, url, data);
            document.location.reload();
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error("Error adding carousel:", err);
            toast.error($, err.message, "Error adding child document");
        } finally {
            toast.close($, toastLoading);
        }
    });

    instanceDoc.on('click', '.carousel-pagination .pagination-remove .glyphicon.pagination-remove:not([disabled])', async (e) => {
        e.preventDefault();
        e.stopPropagation();

        const parent = $(e.target).closest('.pagination-group');
        const select = $('> .pagination-select', parent);
        const option = $('option:selected', select);

        if (option.length) {
            const topEmbedded = findTopEmbedded(e.target);
            const url = topEmbedded.data('warpjsUrl');
            const data = {
                docLevel: $(option).data('warpjsDocLevel')
            };

            const confirmed = await deleteConfirm($, e.target);
            if (confirmed) {
                const toastLoading = toast.loading($, "This can take few seconds. Page will reload when done", "Deleting...");
                try {
                    await proxy.del($, url, data);
                    document.location.reload();
                } catch (err) {
                    // eslint-disable-next-line no-console
                    console.error("Error removing carousel:", err);
                    toast.error($, err.message, "Error removing child document");
                } finally {
                    toast.close($, toastLoading);
                }
            }
        }
    });
};
