const warpjsUtils = require('@warp-works/warpjs-utils');

module.exports = {
    headers: {
        'Accept': warpjsUtils.constants.HAL_CONTENT_TYPE,
        'Content-Type': 'application/json'
    },
    dataType: 'json'
};
