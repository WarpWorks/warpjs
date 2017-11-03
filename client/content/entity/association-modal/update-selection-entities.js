const Promise = require('bluebird');

const constants = require('./constants');
const proxy = require('./../../../proxy');
const template = require('./selection-entities.hbs');

module.exports = ($, instanceDoc) => {
    const option = $(`${constants.DIALOG_SELECTOR} .warpjs-selection-types option:selected`, instanceDoc);

    return Promise.resolve()
        .then(() => proxy.get($, option.data('warpjsUrl')))
        .then((res) => {
            const content = template({entities: res._embedded.entities});
            $(`${constants.DIALOG_SELECTOR} .warpjs-selection-entities`, instanceDoc).html(content);
        });
};
