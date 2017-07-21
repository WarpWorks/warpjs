const {constants} = require('@warp-works/warpjs-utils');
const debug = require('debug')('W2:WarpJS:utils');
const hal = require('hal');
const RoutesInfo = require('@quoin/expressjs-routes-info');
const { createResource } = require('@warp-works/warpjs-utils');

function createResourceFromDocument(instance) {
    const data = {
        type: instance.type
    };

    if (!instance.isRootInstance) {
        data.oid = instance._id;
    }

    return createResource(RoutesInfo.expand('w2-app:app', data), instance);
}

function basicRender(name, data, req, res) {
    const resource = (data instanceof hal.Resource) ? data : createResource(req, data);
    resource.baseUrl = req.app.get('w2-app:baseUrl');

    resource.link('w2WarpJSHome', RoutesInfo.expand('w2-app:home'));
    resource.link('w2WarpJSDomain', RoutesInfo.expand('w2-app:app', data));

    debug("resource=", JSON.stringify(resource, null, 2));
    res.render(name, resource.toJSON());
}

function sendHal(req, res, resource, status) {
    // This `req.warpjsUser` is set in `lib/middlewares.js`.
    resource.warpjsUser = req.warpjsUser || null;

    res.status(status || 200)
        .header('Content-Type', constants.HAL_CONTENT_TYPE)
        .json(resource);
}

module.exports = {
    basicRender,
    createResourceFromDocument,
    HAL_CONTENT_TYPE: constants.HAL_CONTENT_TYPE,
    sendHal
};
