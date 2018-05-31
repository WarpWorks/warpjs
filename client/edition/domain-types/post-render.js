const filterBox = require('./../filter-box');
const progressBarModal = require('./../progress-bar-modal');

module.exports = ($, result) => {
    progressBarModal.show($, 90);

    const filterBoxContainer = $('.panel-heading');
    const itemsContainer = $('.panel-body');

    filterBox($, filterBoxContainer, 'table tbody tr', itemsContainer);

    progressBarModal.show($, 100);
    progressBarModal.hide();
};
