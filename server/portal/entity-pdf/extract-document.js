const warpjsUtils = require('@warp-works/warpjs-utils');

const debug = require('./debug')('extract-document');
const Document = require('./../../../lib/core/first-class/document');
const serverUtils = require('./../../utils');

module.exports = async (req, persistence, type, id, viewName) => {
    debug(`type=${type}, id=${id}, viewName=${viewName}`);

    const entity = await serverUtils.getEntity(null, type);
    const document = await entity.getInstance(persistence, id);

    if (!document.id) {
        throw new warpjsUtils.WarpJSError(`Invalid document '${type}' with id='${id}'.`);
    }

    const isVisible = await Document.isVisible(persistence, entity, document, req.warpjsUser);
    debug(`isVisible=`, isVisible);
    if (!isVisible) {
        return null;
    }

    // debug(`document=`, document);
    const resource = warpjsUtils.createResource(req, {
        type: document.type,
        id: document.id,
        name: document.Name,
        lastUpdated: document.lastUpdated,
        status: document.Status
    }, req);

    debug(`resource=`, resource);

    return resource;
};
