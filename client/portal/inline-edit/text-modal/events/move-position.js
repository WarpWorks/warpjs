const comingSoon = require('./../../coming-soon');

module.exports = ($, modal) => {
    modal.on('click', '[data-warpjs-action="inline-edit-paragraph-move-to-first"]', function() {
        comingSoon($, "Changing position");
    });

    modal.on('click', '[data-warpjs-action="inline-edit-paragraph-move-up"]', function() {
        comingSoon($, "Changing position");
    });

    modal.on('click', '[data-warpjs-action="inline-edit-paragraph-move-down"]', function() {
        comingSoon($, "Changing position");
    });

    modal.on('click', '[data-warpjs-action="inline-edit-paragraph-move-to-last"]', function() {
        comingSoon($, "Changing position");
    });
};
