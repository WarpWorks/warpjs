const comingSoon = require('./../../coming-soon');

module.exports = ($, modal) => {
    modal.on('click', '[data-warpjs-action="inline-edit-delete"]', function() {
        comingSoon($, "Delete this paragraph");
    });
};
