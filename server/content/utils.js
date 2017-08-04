// const debug = require('debug')('W2:WarpJS:utils');
const hal = require('hal');
const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

function createResourceFromDocument(instance) {
    // FIXME: missing domain
    const data = {
        type: instance.type
    };

    if (!instance.isRootInstance) {
        data.id = instance._id;
    }

    return warpjsUtils.createResource(RoutesInfo.expand('W2:content:entity', data), instance);
}

function basicRender(bundles, data, req, res) {
    const resource = (data instanceof hal.Resource) ? data : warpjsUtils.createResource(req, data);
    resource.baseUrl = req.app.get('base-url');
    resource.staticUrl = req.app.get('static-url');

    resource.bundles = bundles;

    // debug("resource=", JSON.stringify(resource, null, 2));
    res.render('content', resource.toJSON());
}

function sendHal(req, res, resource) {
    resource.link('warpjsContentHome', RoutesInfo.expand('W2:content:home'));
    if (req.params.domain) {
        resource.link('warpjsContentDomain', RoutesInfo.expand('W2:content:domain', {
            domain: req.params.domain
        }));
    }

    warpjsUtils.sendHal(req, res, resource, RoutesInfo);
}

module.exports = {
    basicRender,
    createResourceFromDocument,
    sendHal
};
