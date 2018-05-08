const Promise = require('bluebird');
const warpjsUtils = require('@warp-works/warpjs-utils');

module.exports = ($) => {
    // When clicking on a table row, go to that page.
    $(document).on('click', 'tr td[data-warpjs-action="link"][data-warpjs-url]', function() {
        document.location.href = $(this).data('warpjsUrl');
    });

    $(document).on('click', '.table-pagination .pagination-left, .table-pagination .pagination-right', function() {
        const direction = $(this).data('pageDirection');
        console.log("TODO: clicked table pagination", direction);
    });

    $(document).on('click', 'tr td .glyphicon[data-warpjs-action="delete"][data-warpjs-url]', function() {
        console.log("TODO: delete item", this);

        return Promise.resolve()
            .then(() => warpjsUtils.proxy.del($, $(this).data('warpjsUrl')))
            .then((result) => {
                console.log("Deleting done...", result);
            })
            .catch((err) => {
                console.error("Error deleting...", err);
            });
    });
};
