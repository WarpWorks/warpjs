const Promise = require('bluebird');
const warpjsUtils = require('@warp-works/warpjs-utils');

module.exports = ($, element) => {
    const ajaxOptions = {
        method: 'POST',
        url: $(element).data('warpjsUrl'),
        headers: {
            accept: warpjsUtils.constants.HAL_CONTENT_TYPE
        }
    };

    return Promise.resolve()
        .then(() => $.ajax(ajaxOptions))
        .then((res) => {
            document.location.href = res._links.redirect.href;
        })
        .catch((err) => {
            console.log("failed: err=", err);
        });
};
