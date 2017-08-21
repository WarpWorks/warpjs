module.exports = ($) => {
    // When clicking on a table row, go to that page.
    $(document).on('click', 'tr[data-url!=""][data-url]', function() {
        document.location.href = $(this).data('url');
    });

    $(document).on('click', '.table-pagination .pagination-left, .table-pagination .pagination-right', function() {
        const direction = $(this).data('pageDirection');
        console.log("clicked table pagination", direction);
    });
};
