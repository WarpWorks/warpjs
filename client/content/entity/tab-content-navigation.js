module.exports = ($) => {
    // This simulate the click on tabs because we don't have IDs to link to.
    $('.tab-content').on('click', '.nav.nav-tabs > li', function() {
        const tabindex = $(this).data('tabindex');
        $(this).closest('.tab-content').children('.tab-pane').removeClass('active');
        $(this).closest('.tab-content').children(`.tab-pane[data-tabindex="${tabindex}"]`).addClass('active');
    });
};
