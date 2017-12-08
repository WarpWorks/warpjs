const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

module.exports = (err, req, res, next) => {
    // Will be used by the error logger.
    req.warpjsError = err;

    if (!res.headersSent) {
        res.format({
            [warpjsUtils.constants.HAL_CONTENT_TYPE]: () => {
                warpjsUtils.sendError(req, res, RoutesInfo, err);
            },

            default: () => {
                res.status(500).send(`Error: ${err.message}`);
            }
        });
    }
};
