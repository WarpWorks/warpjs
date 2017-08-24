const Promise = require('bluebird');

const constants = require('./constants');
const progressBarModal = require('./../../progress-bar-modal');
const proxy = require('./../../proxy');
const template = require('./entities.hbs');

module.exports = ($, instanceDoc) => {
    instanceDoc.on('change', `.${constants.SELECTION_MODAL_CLASS} .warpjs-selection-types`, function() {
        const url = $('option:selected', this).data('warpjsUrl');

        return Promise.resolve()
            .then(() => progressBarModal.show($, 25))
            .then(() => proxy.get($, url))
            .then((res) => {
                progressBarModal.show($, 50);

                // TODO: Show when no results.
                const content = template({
                    entities: res._embedded.entities
                });
                $(`.${constants.SELECTION_MODAL_CLASS} .warpjs-selection-entities`).html(content);
            })
            .then(() => progressBarModal.show($, 100))
            .then(() => progressBarModal.hide());
    });
};
