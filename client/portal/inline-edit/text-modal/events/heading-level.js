const Promise = require('bluebird');

const patchData = require('./../../patch-data');

module.exports = ($, modal) => {
    modal.on('change', '#warpjs-inline-edit-level', function() {
        return Promise.resolve()
            .then(() => patchData($, modal, this))
            .then((success) => {
                if (success) {
                    const newLevel = $(this).val();

                    $(`.warpjs-list-item.warpjs-list-item-selected`)
                        .removeClass('warpjs-list-item-level-H1')
                        .removeClass('warpjs-list-item-level-H2')
                        .removeClass('warpjs-list-item-level-H3')
                        .removeClass('warpjs-list-item-level-H4')
                        .removeClass('warpjs-list-item-level-H5')
                        .addClass(`warpjs-list-item-level-${newLevel}`);

                    $(`.warpjs-list-item.warpjs-list-item-selected .warpjs-list-item-value`)
                        .data('warpjsLevel', newLevel);
                }
            })
        ;
    });
};
