const comingSoon = require('./../../coming-soon');

module.exports = ($, modal) => {
    modal.on('click', '[data-warpjs-action="inline-edit-history"]', function() {
        comingSoon($, "Document's history");
    });
};
