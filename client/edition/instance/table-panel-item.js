const Promise = require('bluebird');
const { proxy } = require('@warp-works/warpjs-utils');

const ChangeLogs = require('./../change-logs');

module.exports = ($) => {
    // When clicking on a table row, go to that page.
    $(document).on('click', 'tr td[data-warpjs-action="link"][data-warpjs-url]', function() {
        console.log("follow table row URL...");
        document.location.href = $(this).data('warpjsUrl');
    });

    $(document).on('click', '.table-pagination .pagination-left, .table-pagination .pagination-right', function() {
        const direction = $(this).data('pageDirection');
        console.log("TODO: clicked table pagination", direction);
    });

    $(document).on('click', 'tr td .glyphicon[data-warpjs-action="delete"][data-warpjs-url]', function() {
        console.log("TODO: delete item", this);

        return Promise.resolve()
            .then(() => proxy.del($, $(this).data('warpjsUrl')))
            .then((result) => {
                console.log("Deleting done...", result);
            })
            .then(() => ChangeLogs.dirty())
            .catch((err) => {
                console.error("Error deleting...", err);
            });
    });
};
