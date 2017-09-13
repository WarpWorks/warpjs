const Promise = require('bluebird');

const constants = require('./constants');
const patch = require('./../../../patch');

module.exports = ($, instanceDoc) => {
    instanceDoc.on('change', `${constants.DIALOG_SELECTOR} textarea.warpjs-relationship-description`, function() {
        const docLevel = $(this).data('warpjsDocLevel');
        const newValue = $(this).val();

        $(`li[data-warpjs-doc-level="${docLevel}"]`, instanceDoc).data('warpjsRelationshipDescription', newValue);

        return Promise.resolve()
            .then(() => patch($, docLevel, newValue))
            .then((res) => {
                console.log("Patch done.");
            })
            .catch((err) => {
                console.log("***ERROR***: Patch failed:", err);
            })
        ;
    });
};
