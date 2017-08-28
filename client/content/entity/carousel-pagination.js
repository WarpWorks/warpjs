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

    instanceDoc.on('click', '.carousel-pagination .pagination-add .glyphicon', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log("add new embedded", this);
        const carouselPagination = $(this).closest('.carousel-pagination');
        console.log("carousel-pagination=", carouselPagination);
    });
};
