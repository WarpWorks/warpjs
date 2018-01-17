// const debug = require('debug')('W2:WarpJS:utils');
const hal = require('hal');
const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const constants = require('./constants');

function createResourceFromDocument(instance) {
    // FIXME: missing domain
    const data = {
        type: instance.type
    };

    if (!instance.isRootInstance) {
        data.oid = instance._id; // FIXME: debug
        data.id = instance._id;
    }

    return warpjsUtils.createResource(RoutesInfo.expand(constants.routes.instance, data), instance);
}

function basicRender(bundles, data, req, res) {
    const resource = (data instanceof hal.Resource) ? data : warpjsUtils.createResource(req, data);
    resource.baseUrl = req.app.get('base-url');
    resource.staticUrl = req.app.get('static-url');

    resource.bundles = bundles;

    // debug("resource=", JSON.stringify(resource, null, 2));
    res.render('index-content', resource.toJSON());
}

function sendHal(req, res, resource, status) {
    resource.link('warpjsHome', RoutesInfo.expand(constants.routes.home, {}));
    if (req.params.domain) {
        resource.link('warpjsDomain', RoutesInfo.expand(constants.routes.domain, {
            domain: req.params.domain
        }));
    }

    warpjsUtils.sendHal(req, res, resource, RoutesInfo, status);
}

function sendHalOnly(req, res, resource, status) {
    res.status(status || 200)
        .header('Content-Type', warpjsUtils.constants.HAL_CONTENT_TYPE)
        .send(resource.toJSON());
}

function basicRenderOld(name, data, req, res) {
    const resource = (data instanceof hal.Resource) ? data : warpjsUtils.createResource(req, data);
    resource.baseUrl = '/static';

    resource.link('w2WarpJSHome', RoutesInfo.expand(constants.routes.home, {}));
    resource.link('w2WarpJSDomain', RoutesInfo.expand(constants.routes.instances, data));

    res.render(name, resource.toJSON());
}

module.exports = {
    basicRender,
    basicRenderOld,
    createResourceFromDocument,
    sendHal,
    sendHalOnly
};
