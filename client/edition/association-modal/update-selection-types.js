const Promise = require('bluebird');

const constants = require('./constants');
const selectionEntitiesErrorTemplate = require('./selection-entities-error.hbs');
const selectOptionsTemplate = require('./select-options.hbs');
const selectionEntitiesLoadingTemplate = require('./selection-entities-loading.hbs');
const typesOptionErrorTemplate = require('./types-option-error.hbs');
const typesOptionLoadingTemplate = require('./types-option-loading.hbs');
const updateSelectionEntities = require('./update-selection-entities');

module.exports = ($, instanceDoc) => {
    const element = $(constants.DIALOG_SELECTOR, instanceDoc).data(constants.CURRENT_ELEMENT_KEY);
    $(`${constants.DIALOG_SELECTOR} .${constants.SELECTION_TYPES}`, instanceDoc).html(typesOptionLoadingTemplate());
    $(`${constants.DIALOG_SELECTOR} .${constants.SELECTION_ENTITIES}`, instanceDoc).html(selectionEntitiesLoadingTemplate());

    return Promise.resolve()
        .then(() => window.WarpJS.proxy.get($, $(element).data('warpjsTypesUrl')))
        .then((res) => {
            const content = selectOptionsTemplate({entities: res._embedded.entities});
            $(`${constants.DIALOG_SELECTOR} .${constants.SELECTION_TYPES}`, instanceDoc).html(content);
        })
        .then(() => updateSelectionEntities($, instanceDoc))
        .catch((err) => {
            console.error("Error updating selection types:", err);
            window.WarpJS.toast.error($, "Error getting data from server.", "Data error");
            $(`${constants.DIALOG_SELECTOR} .${constants.SELECTION_TYPES}`, instanceDoc).html(typesOptionErrorTemplate());
            $(`${constants.DIALOG_SELECTOR} .${constants.SELECTION_ENTITIES}`, instanceDoc).html(selectionEntitiesErrorTemplate());
        })
    ;
};
