const Promise = require('bluebird');

const proxy = require('./../../proxy');

module.exports = ($, element) => Promise.resolve()
    .then(() => proxy.post($, $(element).data('warpjsUrl')))
    .then((res) => {
        document.location.href = res._links.redirect.href;
    })
    .catch((err) => {
        console.log("failed: err=", err);
    });
;
