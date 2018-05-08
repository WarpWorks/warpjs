const constants = require('./constants');

module.exports = ($, instanceDoc) => {
    $(`.${constants.SELECTION_MODAL_CLASS} .warpjs-selection-types`).val('');
    $(`.${constants.SELECTION_MODAL_CLASS} .warpjs-selection-entities`).empty();
    $(`.${constants.SELECTION_MODAL_CLASS} .warpjs-selected-entities`).empty();
};
