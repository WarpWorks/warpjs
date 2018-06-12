const FilterBox = require('@warp-works/warpjs-filter-box');
const ProgressBarModal = require('@warp-works/progress-bar-modal');

const actionDeleteRow = require('./action-delete-row');
const actionLink = require('./action-link');
const actionGoto = require('./action-goto');
const addChild = require('./add-child');
const addSibling = require('./add-sibling');
const associationModal = require('./association-modal');
const carouselPagination = require('./carousel-pagination');
const ChangeLogs = require('./../change-logs');
const deleteEntity = require('./delete-entity');
const patchEntity = require('./patch-entity');
const tabContentNavigation = require('./tab-content-navigation');
const tablePanelItem = require('./table-panel-item');
const documentStatus = require('./document-status');
const wysiwygEditor = require('./wysiwyg-editor');

module.exports = ($, result) => {
    ProgressBarModal.show($, 100);
    ProgressBarModal.hide();

    const instanceDoc = $('[data-warpjs-status="instance"]');

    actionDeleteRow($, instanceDoc);
    actionLink($, instanceDoc);
    actionGoto($, instanceDoc);
    associationModal($, instanceDoc);
    ChangeLogs.init($, instanceDoc);
    wysiwygEditor($, instanceDoc);

    tabContentNavigation($);
    carouselPagination($, instanceDoc);
    deleteEntity($);
    addSibling($);
    addChild($);
    patchEntity($);
    tablePanelItem($);
    documentStatus($, instanceDoc);

    FilterBox.init($);
};
