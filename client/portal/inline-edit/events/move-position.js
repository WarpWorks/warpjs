const ChangeLogs = require('./../change-logs');
const moveAndSave = require('./../move-and-save');

module.exports = async ($, modal, event, items, offset) => {
    const itemId = $(event.target).closest('.warpjs-navigation-menu').data('warpjsId');
    await moveAndSave($, modal, itemId, items, offset);
    ChangeLogs.dirty();
};
