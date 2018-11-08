const Promise = require('bluebird');

const moveAndSave = require('./../move-and-save');

module.exports = ($, modal, event, items, offset) => Promise.resolve()
    .then(() => $(event.target).closest('.warpjs-navigation-menu').data('warpjsId'))
    .then((itemId) => moveAndSave($, modal, itemId, items, offset))
;
