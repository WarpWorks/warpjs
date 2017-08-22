const addChild = require('./add-child');
const addSibling = require('./add-sibling');
const associationModal = require('./association-modal');
const carouselPagination = require('./carousel-pagination');
const deleteEntity = require('./delete-entity');
const patchEntity = require('./patch-entity');
const progressBarModal = require('./../progress-bar-modal');
const tabContentNavigation = require('./tab-content-navigation');
const tablePanelItem = require('./table-panel-item');

module.exports = ($, result) => {
    progressBarModal.show($, 100);
    progressBarModal.hide();

    associationModal($);
    tabContentNavigation($);
    carouselPagination($);
    deleteEntity($);
    addSibling($);
    addChild($);
    patchEntity($);
    tablePanelItem($);
};
