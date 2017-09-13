const Promise = require('bluebird');

module.exports = ($, instanceDoc) => {
    instanceDoc.on('click', '[data-warpjs-action="delete-row"][data-warpjs-url]', function() {
        const ajaxOptions = {
            method: 'DELETE',
            url: $(this).data('warpjsUrl')
        };

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

        // async server delete.
        Promise.resolve()
            .then(() => $.ajax(ajaxOptions))
            // TODO: Give UI feedback on error
            .catch((err) => console.log("Error delete-row on server:", err));
    });
};
