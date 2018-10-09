module.exports = ($) => {
    // This simulate the click on tabs because we don't have IDs to link to.
    $('.tab-content').on('click', '.nav.nav-tabs > li', (event) => {
        const tabindex = $(event.currentTarget).data('tabindex');

        $(event.currentTarget).closest('.nav-tabs').children().removeClass('active');
        $(event.currentTarget).addClass('active');

        $(event.currentTarget).closest('.tab-content').children('.tab-pane').removeClass('active');
        $(event.currentTarget).closest('.tab-content').children(`.tab-pane[data-tabindex="${tabindex}"]`).addClass('active');
    });
};
