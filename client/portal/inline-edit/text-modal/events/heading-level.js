const Promise = require('bluebird');

const ChangeLogs = require('./../../change-logs');
const patchData = require('./../../patch-data');

module.exports = ($, modal) => {
    modal.on('change', "input[name='warpjs-inline-edit-level']", function(e) {
        return Promise.resolve()
            .then(() => patchData($, modal, $("input[name='warpjs-inline-edit-level']:checked")))
            .then((success) => {
                if (success) {
                    ChangeLogs.dirty();
                }
            })
        ;
    });
};
