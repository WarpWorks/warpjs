const Promise = require('bluebird');
const { proxy, toast } = require('@warp-works/warpjs-utils');

const deleteConfirm = require('./delete-confirm');

module.exports = ($, instanceDoc) => {
    instanceDoc.on('click', '[data-warpjs-action="delete-row"][data-warpjs-url]:not([disabled])', function() {
        Promise.resolve()
            .then(() => deleteConfirm($, this))
            .then((confirmed) => {
                if (confirmed) {
                    Promise.resolve()
                        .then(() => toast.loading($, "This can take few seconds.", "Deleting..."))
                        .then((toastLoading) => Promise.resolve()
                            .then(() => proxy.del($, $(this).data('warpjsUrl')))
                            .then((res) => {
                                toast.success($, "Deleted");

                                // Immediate UI feedback

                                // Updating table counters
                                const paginationTable = $(this).closest('table').siblings('.table-pagination');
                                const pageStart = parseInt($('.table-pagination-page-start', paginationTable).text(), 10);
                                const pageEnd = parseInt($('.table-pagination-page-end', paginationTable).text(), 10);
                                $('.table-pagination-page-end', paginationTable).text(pageEnd - 1);
                                const pageTotal = parseInt($('.table-pagination-total-size', paginationTable).text(), 10);
                                $('.table-pagination-total-size', paginationTable).text(pageTotal - 1);
                                if (pageEnd === pageStart) {
                                    // We deleted the last element on the current page.
                                    if (pageStart === 1) {
                                        // We are on the first page.
                                        $('.table-pagination-page-start', paginationTable).text(0);
                                    } else {
                                        console.log("TODO: go to previous page if possible.");
                                    }
                                }
                                $(this).closest('tr').remove();
                            })
                            .catch((err) => {
                                console.error("Error delete-row on server:", err);
                                toast.error($, err.message, "Error deleting element");
                            })
                            .finally(() => toast.close($, toastLoading))
                        )
                    ;
                }
            })
        ;
    });
};
