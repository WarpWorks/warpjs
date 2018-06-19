const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

module.exports = (req, res, err) => {
    // eslint-disable-next-line no-console
    console.error("sendError(): err=", err); // TODO: Put this in an error.log file?
    const resource = warpjsUtils.createResource(req, {
        message: "Error during processing content.",
        ErrMessage: err.message
    });
    warpjsUtils.sendHal(req, res, resource, RoutesInfo, 500);
};
