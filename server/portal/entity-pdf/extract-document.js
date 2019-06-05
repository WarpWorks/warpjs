const warpjsUtils = require('@warp-works/warpjs-utils');

// const debug = require('./debug')('extract-document');
const Document = require('./../../../lib/core/first-class/document');
const extractCommunity = require('./extract-community');
const extractOverview = require('./extract-overview');
const generateTocNumbers = require('./generate-toc-numbers');
const serverUtils = require('./../../utils');

module.exports = async (req, persistence, type, id, viewName, level = 0) => {
    const entity = await serverUtils.getEntity(null, type);
    const document = await entity.getInstance(persistence, id);

    if (!document.id) {
        throw new warpjsUtils.WarpJSError(`Invalid document '${type}' with id='${id}'.`);
    }

    const isVisible = await Document.isVisible(persistence, entity, document, req.warpjsUser);
    if (!isVisible) {
        return null;
    }

    const resource = warpjsUtils.createResource(req, {
        type: document.type,
        typeID: document.typeID || entity.id,
        id: document.id,
        name: document.Name,
        lastUpdated: document.lastUpdated,
        status: document.Status
    }, req);

    if (!level) {
        // Add links only for top document.
        resource.link('home', {
            title: "Home",
            href: warpjsUtils.fullUrl(req, '/')
        });
    }

    const overview = await extractOverview(req, persistence, entity, document, viewName, level);
    resource.embed('items', overview);

    // Only keep the community at the first level.
    if (!level) {
        const editorResources = await extractCommunity(req, persistence, entity, document, 'Editors');
        if (editorResources) {
            resource.embed('items', editorResources);
        }

        const authorsResource = await extractCommunity(req, persistence, entity, document, 'Authors');
        if (authorsResource) {
            resource.embed('items', authorsResource);
        }

        const contributorsResource = await extractCommunity(req, persistence, entity, document, 'Contributors');
        if (contributorsResource) {
            resource.embed('items', contributorsResource);
        }

        generateTocNumbers(resource);
    }

    return resource;
};
