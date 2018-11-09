const comingSoon = require('./../../coming-soon');

module.exports = ($, modal) => {
    modal.on('click', '[data-warpjs-action="inline-edit-history"]', (event) => {
        event.preventDefault();
        comingSoon($, "Document's history");
    });
};
