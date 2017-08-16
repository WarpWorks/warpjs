const carouselPagination = require('./carousel-pagination');
const deleteEntity = require('./delete-entity');
const patchEntity = require('./patch-entity');
const progressBarModal = require('./../progress-bar-modal');
const tabContentNavigation = require('./tab-content-navigation');

module.exports = ($, result) => {
    progressBarModal.show($, 100);
    progressBarModal.hide();

    tabContentNavigation($);
    carouselPagination($);
    deleteEntity($);
    patchEntity($);

    // TODO: add a sibling
};
