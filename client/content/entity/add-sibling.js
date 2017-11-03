const postAndRedirect = require('./post-and-redirect');

module.exports = ($) => {
    $('[data-warpjs-status="instance"] [data-warpjs-action="add-sibling"]:not([disabled])').on('click', function() {
        postAndRedirect($, this);
    });
};
