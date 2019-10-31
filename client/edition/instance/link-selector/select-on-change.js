const Promise = require('bluebird');

const constants = require('./constants');
const template = require('./entities.hbs');

module.exports = ($, instanceDoc) => {
    const { proxy } = window.WarpJS;

    instanceDoc.on('change', `.${constants.SELECTION_MODAL_CLASS} .warpjs-selection-types`, function() {
        const url = $('option:selected', this).data('warpjsUrl');

        return Promise.resolve()
            .then(() => proxy.get($, url))
            .then((res) => {
                const content = template({
                    entities: res._embedded.entities
                });
                $(`.${constants.SELECTION_MODAL_CLASS} .warpjs-selection-entities`).html(content);
            });
    });
};
