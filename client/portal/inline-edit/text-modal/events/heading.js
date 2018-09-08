const Promise = require('bluebird');

const patchData = require('./../../patch-data');

module.exports = ($, modal) => {
    modal.on('change', '#warpjs-inline-edit-heading', function() {
        return Promise.resolve()
            .then(() => patchData($, modal, this))
            .then((success) => {
                if (success) {
                    const id = $(this).data('warpjsId');
                    const newValue = $(this).val().trim();

                    const listItemValue = $(`.warpjs-document-elements .warpjs-list-item .warpjs-list-item-value[data-warpjs-id="${id}"]`, modal);
                    if (newValue) {
                        listItemValue.removeClass('warpjs-list-item-value-untitled').data('warpjsName', newValue).text(newValue);
                    } else {
                        listItemValue.addClass('warpjs-list-item-value-untitled').data('warpjsName', newValue).text('untitled');
                    }
                }
            })
        ;
    });
};
