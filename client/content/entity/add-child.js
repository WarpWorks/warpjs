const postAndRedirect = require('./post-and-redirect');

module.exports = ($) => {
    $('[data-warpjs-status="instance"]').on('click', '[data-warpjs-action="add-child"]', function() {
        postAndRedirect($, this);
    });
};
