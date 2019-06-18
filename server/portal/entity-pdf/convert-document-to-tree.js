const warpjsUtils = require('@warp-works/warpjs-utils');

// const debug = require('./debug')('convert-document-to-tree');
const rebuildItemsTree = require('./rebuild-items-tree');

const { MAX_TOC_DEEP_LEVEL } = require('./constants');

module.exports = (resource, tocLevel = 1) => {
    const newResource = warpjsUtils.createResource(resource._links.self.href, {
        type: resource.type,
        typeID: resource.typeID,
        id: resource.id,
        name: resource.name,
        version: resource.version,
        lastUpdated: resource.lastUpdated,
        status: resource.status,
        description: resource.description,
        keywords: resource.keywords,
        author: resource.author
    });

    if ((tocLevel < MAX_TOC_DEEP_LEVEL) && resource._embedded && resource._embedded.items) {
        newResource.embed('items', rebuildItemsTree(resource._embedded.items, 1, 0, tocLevel));
    }

    return newResource;
};
