const carouselPagination = require('./carousel-pagination');
const deleteEntity = require('./delete-entity');
const patchEntity = require('./patch-entity');
const progressBarModal = require('./../progress-bar-modal');
const tabContentNavigation = require('./tab-content-navigation');
const tablePanelItem = require('./table-panel-item');

module.exports = ($, result) => {
    progressBarModal.show($, 100);
    progressBarModal.hide();

    tabContentNavigation($);
    carouselPagination($);
    deleteEntity($);
    patchEntity($);
    tablePanelItem($);

    // TODO: add a sibling
};
