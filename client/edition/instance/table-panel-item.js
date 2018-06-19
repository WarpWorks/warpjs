module.exports = ($) => {
    // When clicking on a table row, go to that page.
    $(document).on('click', 'tr td[data-warpjs-action="link"][data-warpjs-url]', function() {
        document.location.href = $(this).data('warpjsUrl');
    });

    // $(document).on('click', '.table-pagination .pagination-left, .table-pagination .pagination-right', function() {
    //     const direction = $(this).data('pageDirection');
    //     console.log("TODO: clicked table pagination", direction);
    // });
};
