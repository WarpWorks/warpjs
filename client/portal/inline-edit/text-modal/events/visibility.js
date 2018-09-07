const comingSoon = require('./../../coming-soon');

module.exports = ($, modal) => {
    modal.on('change', '#warpjs-inline-edit-visibility', function() {
        comingSoon($, "Handling Visibility");
    });
};
