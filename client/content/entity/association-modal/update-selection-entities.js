const Promise = require('bluebird');
const warpjsUtils = require('@warp-works/warpjs-utils');

const constants = require('./constants');
const template = require('./selection-entities.hbs');
const loadingTemplate = require('./selection-entities-loading.hbs');

module.exports = ($, instanceDoc) => {
    const option = $(`${constants.DIALOG_SELECTOR} .warpjs-selection-types option:selected`, instanceDoc);

    return Promise.resolve()
        .then(() => $(`${constants.DIALOG_SELECTOR} .warpjs-selection-entities`, instanceDoc).html(loadingTemplate()))
        .then(() => warpjsUtils.proxy.get($, option.data('warpjsUrl')))
        .then((res) => {
            const content = template({entities: res._embedded.entities});
            $(`${constants.DIALOG_SELECTOR} .warpjs-selection-entities`, instanceDoc).html(content);
        });
};
