const Promise = require('bluebird');

const proxy = require('./../../proxy');

module.exports = ($) => {
    $(document).on('click', '[data-warpjs-action="delete"][data-warpjs-url]:not([disabled])', function() {
        console.log("delete:", $(this).data('url'));

        return Promise.resolve()
            .then(() => proxy.del($, $(this).data('url')))
            .then((res) => {
                console.log("res=", res);
            })
            .catch((err) => {
                console.log("res ERRORS=", err);
            })
            .finally(() => {
            });
    });
};
