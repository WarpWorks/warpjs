const progressBarModal = require('./../progress-bar-modal');

module.exports = ($, result) => {
    progressBarModal.show($, 100);
    progressBarModal.hide();

    // This simulate the click on tabs because we don't have IDs to link to.
    $('.tab-content').on('click', '.nav.nav-tabs > li', function() {
        const tabindex = $(this).data('tabindex');
        console.log("clicked:", this);
        $(this).closest('.tab-content').children('.tab-pane').removeClass('active');
        $(this).closest('.tab-content').children(`.tab-pane[data-tabindex="${tabindex}"]`).addClass('active');
    });
};
