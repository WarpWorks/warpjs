const Promise = require('bluebird');

const ChangeLogs = require('./../../change-logs');
const patchData = require('./../../patch-data');

module.exports = ($, modal) => {
    modal.on('change', '#warpjs-inline-edit-visibility', function() {
        return Promise.resolve()
            .then(() => patchData($, modal, this))
            .then((success) => {
                if (success) {
                    ChangeLogs.dirty();
                }
            })
        ;
    });
};
