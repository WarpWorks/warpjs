const ChangeLogs = require('./../../change-logs');
const patchData = require('./../../patch-data');

module.exports = ($, modal) => {
    modal.on('change', "input[name='warpjs-inline-edit-level']", async () => {
        const success = await patchData($, modal, $("input[name='warpjs-inline-edit-level']:checked"));

        if (success) {
            ChangeLogs.dirty();
            const newLevel = $("input[name='warpjs-inline-edit-level']:checked").val();
            $(`.warpjs-list-item.warpjs-list-item-selected`)
                .removeClass('warpjs-list-item-level-H1')
                .removeClass('warpjs-list-item-level-H2')
                .removeClass('warpjs-list-item-level-H3')
                .removeClass('warpjs-list-item-level-H4')
                .removeClass('warpjs-list-item-level-H5')
                .addClass(`warpjs-list-item-level-${newLevel}`);
            $(`.warpjs-list-item.warpjs-list-item-selected .warpjs-list-item-value`).data('warpjsLevel', newLevel);
        }
    });
};
