const Promise = require('bluebird');

const ChangeLogs = require('./../../change-logs');
const patchData = require('./../../patch-data');

module.exports = ($, modal) => {
    modal.on('change', '#warpjs-inline-edit-visibility', function() {
        console.log('value of visibility', $('#warpjs-inline-edit-visibility').val());
        return Promise.resolve()
            .then(() => patchData($, modal, this))
            .then((success) => {
                if (success) {
                    ChangeLogs.dirty();
                    console.log('successfully saved visibility');
                }
            })
        ;
    });
};
