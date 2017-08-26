const Promise = require('bluebird');

const constants = require('./constants');
const query = require('./../../../query');

module.exports = ($, instanceDoc, element) => {
    instanceDoc.on('click', `${constants.DIALOG_SELECTOR} .warpjs-selected-details .warpjs-remove`, function() {
        const textarea = $(`${constants.DIALOG_SELECTOR} .warpjs-selected-details .warpjs-relationship-description`, instanceDoc);

        const id = textarea.data('warpjsId');
        const type = textarea.data('warpjsType');

        console.log("clicked remove:", this);

        return Promise.resolve()
            .then(() => query($, 'PATCH', {id, type}, $(element).data('warpjsUrl')))
            .then(() => {
                const basic = `li[data-warpjs-type="${type}"][data-warpjs-id="${id}"]`;

                $(`${constants.DIALOG_SELECTOR} .warpjs-selected-entities ${basic}`, instanceDoc).remove();
                $(basic, $(element).closest('.warpjs-selected-entities')).remove();
            })
            .catch((err) => console.log("Error removing association", err))
        ;
    });
};
