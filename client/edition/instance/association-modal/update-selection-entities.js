const Promise = require('bluebird');
const warpjsUtils = require('@warp-works/warpjs-utils');

const constants = require('./constants');
const template = require('./selection-entities.hbs');
const loadingTemplate = require('./selection-entities-loading.hbs');
const errorTemplate = require('./selection-entities-error.hbs');

module.exports = ($, instanceDoc) => {
    const option = $(`${constants.DIALOG_SELECTOR} .${constants.SELECTION_TYPES} option:selected`, instanceDoc);

    return Promise.resolve()
        .then(() => $(`${constants.DIALOG_SELECTOR} .${constants.SELECTION_ENTITIES}`, instanceDoc).html(loadingTemplate()))
        .then(() => warpjsUtils.proxy.get($, option.data('warpjsUrl')))
        .then((res) => {
            const content = template({entities: res._embedded.entities});
            $(`${constants.DIALOG_SELECTOR} .${constants.SELECTION_ENTITIES}`, instanceDoc).html(content);
        })
        .catch((err) => {
            console.error(`Error update-selection-entities:`, err);
            warpjsUtils.toast.error($, err.message, "Error update-selection-entities");
            $(`${constants.DIALOG_SELECTOR} .${constants.SELECTION_ENTITIES}`, instanceDoc).html(errorTemplate());
        })
    ;
};
