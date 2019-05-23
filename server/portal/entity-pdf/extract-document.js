const warpjsUtils = require('@warp-works/warpjs-utils');

const debug = require('./debug')('extract-document');
const Document = require('./../../../lib/core/first-class/document');
const extractOverview = require('./extract-overview');
// const extractPageViewPanels = require('./extract-page-view-panels');
const serverUtils = require('./../../utils');

module.exports = async (req, persistence, type, id, viewName, level = 0) => {
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
        typeID: document.typeID,
        id: document.id,
        name: document.Name,
        lastUpdated: document.lastUpdated,
        status: document.Status
    }, req);

    const overview = await extractOverview(req, persistence, entity, document, viewName);
    resource.embed('panels', overview);

    // const pageView = entity.getPageViewByNames(viewName, 'PdfView', 'DefaultPortalView');
    // const panelResources = await extractPageViewPanels(persistence, entity, document, req.warpjsUser, pageView);

    // resource.embed('panels', panelResources);
    debug(`resource=`, resource);

    return resource;
};
