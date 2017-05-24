const debug = require('debug')('W2:WarpJS:utils');
const hal = require('hal');
const RoutesInfo = require('@quoin/expressjs-routes-info');

const HAL_CONTENT_TYPE = 'application/hal+json';

function createResource(reqOrPath, data) {
    if (typeof reqOrPath === 'string') {
        return new hal.Resource(data, reqOrPath || null);
    }
    return new hal.Resource(data, (reqOrPath && reqOrPath.originalUrl) || null);
}

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
        .header('Content-Type', HAL_CONTENT_TYPE)
        .json(resource);
}

module.exports = {
    basicRender,
    createResource,
    createResourceFromDocument,
    HAL_CONTENT_TYPE,
    sendHal
};
