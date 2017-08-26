const Promise = require('bluebird');

const constants = require('./constants');
const proxy = require('./../../proxy');
const selectOptionsTemplate = require('./select-options.hbs');
const updateSelectionEntities = require('./update-selection-entities');

module.exports = ($, instanceDoc, element) => {
    return Promise.resolve()
        .then(() => proxy.get($, $(element).data('warpjsTypesUrl')))
        .then((res) => {
            const content = selectOptionsTemplate({entities: res._embedded.entities});
            $(`${constants.DIALOG_SELECTOR} .warpjs-selection-types`, instanceDoc).html(content);
        })
        .then(() => updateSelectionEntities($, instanceDoc))
    ;
};
