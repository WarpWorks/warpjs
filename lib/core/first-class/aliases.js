const warpjsUtils = require('@warp-works/warpjs-utils');

// const debug = require('./debug')('aliases');
const serverUtils = require('./../../../server/utils');

const VALIDITY = 5 * 60 * 1000;

const cache = {};

let pathAliasEntity;
let reverseAliasAssociation;

const update = async (path) => {
    if (!pathAliasEntity) {
        pathAliasEntity = await serverUtils.getEntity(null, 'PathAlias');

        const relationships = pathAliasEntity.getRelationships();

        // Find the reverse relationship for Content/Alias
        reverseAliasAssociation = relationships.reduce(
            (memo, relationship, idx) => {
                if (memo) {
                    return memo;
                }

                if (relationship.isReverse()) {
                    const reverseRelationship = relationship.getReverseRelationship();
                    if (reverseRelationship.name === 'Alias' && reverseRelationship.getParent_Entity().name === 'Content') {
                        return relationship;
                    }
                }
            },
            null
        );
    }

    if (reverseAliasAssociation) {
        const persistence = serverUtils.getPersistence();
        try {
            const pathAliases = await pathAliasEntity.getDocuments(persistence, { Name: path });
            if (!pathAliases || !pathAliases.length) {
                return null;
            }

            const pathAlias = pathAliases[0];

            if (pathAlias.URL) {
                cache[path] = Object.freeze({
                    url: pathAlias.URL,
                    timestamp: Date.now() + VALIDITY
                });
            } else {
                const contentDocuments = await reverseAliasAssociation.getDocuments(persistence, pathAlias);

                contentDocuments.sort(warpjsUtils.byStatusThenVersion);

                const firstContentDocument = contentDocuments[0];
                cache[path] = Object.freeze({
                    id: firstContentDocument.id,
                    type: firstContentDocument.type,
                    typeID: firstContentDocument.typeID,
                    view: pathAlias.View || undefined,
                    timestamp: Date.now() + VALIDITY
                });
            }

            return cache[path];
        } finally {
            persistence.close();
        }
    }
};

const get = async (path) => {
    path = (path[0] === '/') ? path.substr(1) : path;
    let aliasInfo = cache[path];
    if (!aliasInfo) {
        aliasInfo = await update(path);
    }

    if (!aliasInfo || Date.now() > aliasInfo.timestamp) {
        aliasInfo = await update(path);
    }

    return aliasInfo;
};

module.exports = Object.freeze({
    get: async (path) => get(path),
    remove: (path) => {
        delete cache[path];
    }
});
