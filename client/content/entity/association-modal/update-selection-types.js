const Promise = require('bluebird');

const constants = require('./constants');
const proxy = require('./../../proxy');
const selectOptionsTemplate = require('./select-options.hbs');
const selectionEntitiesLoadingTemplate = require('./selection-entities-loading.hbs');
const typesOptionLoadingTemplate = require('./types-option-loading.hbs');
const updateSelectionEntities = require('./update-selection-entities');

module.exports = ($, instanceDoc) => {
    const element = $(constants.DIALOG_SELECTOR, instanceDoc).data(constants.CURRENT_ELEMENT_KEY);
    $(`${constants.DIALOG_SELECTOR} .warpjs-selection-types`, instanceDoc).html(typesOptionLoadingTemplate());
    $(`${constants.DIALOG_SELECTOR} .warpjs-selection-entities`, instanceDoc).html(selectionEntitiesLoadingTemplate());

    return Promise.resolve()
        .then(() => proxy.get($, $(element).data('warpjsTypesUrl')))
        .then((res) => {
            const content = selectOptionsTemplate({entities: res._embedded.entities});
            $(`${constants.DIALOG_SELECTOR} .warpjs-selection-types`, instanceDoc).html(content);
        })
        .then(() => updateSelectionEntities($, instanceDoc))
    ;
};
