const warpjsUtils = require('@warp-works/warpjs-utils');

// const debug = require('./debug')('convert-document-to-tree');
const rebuildItemsTree = require('./rebuild-items-tree');

const MAX_DEEP_LEVEL = 7;

module.exports = (resource, deepLevelsRemaining = MAX_DEEP_LEVEL) => {
    // debug(`resource=`, resource);

    const newResource = warpjsUtils.createResource(resource._links.self.href, {
        type: resource.type,
        typeID: resource.typeID,
        id: resource.id,
        name: resource.name,
        lastUpdated: resource.lastUpdated,
        status: resource.status
    });

    if (resource._embedded && resource._embedded.items) {
        newResource.embed('items', rebuildItemsTree(resource._embedded.items, 1, 0, deepLevelsRemaining));
    }

    return newResource;
};
