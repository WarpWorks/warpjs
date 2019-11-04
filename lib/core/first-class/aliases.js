const Promise = require('bluebird');

const warpjsUtils = require('@warp-works/warpjs-utils');

const serverUtils = require('./../../../server/utils');

// const debug = require('./debug')('aliases');

const VALIDITY = 5 * 60 * 1000;

const cache = {};

let pathAliasEntity;
let reverseAliasAssociation;

const getPathAliasEntity = async () => serverUtils.getEntity(null, 'PathAlias');

const getReverseAliasAssociation = (entity) => entity.getRelationships().reduce(
    (foundRelationship, relationship) => {
        if (foundRelationship) {
            return foundRelationship;
        }

        if (relationship.isReverse()) {
            const reverseRelationship = relationship.getReverseRelationship();
            if (reverseRelationship.name === 'Alias' && reverseRelationship.getParent_Entity().name === 'Content') {
                return relationship;
            } else {
                return null;
            }
        } else {
            return null;
        }
    },
    null
);

const getAliasInfo = async (persistence, relationship, document) => {
    if (document.URL) {
        return Object.freeze({
            url: document.URL,
            timestamp: Date.now() + VALIDITY
        });
    }

    const contentDocuments = await relationship.getDocuments(persistence, document);
    contentDocuments.sort(warpjsUtils.byStatusThenVersion);

    const firstContentDocument = contentDocuments[0];
    return Object.freeze({
        id: firstContentDocument.id,
        type: firstContentDocument.type,
        typeID: firstContentDocument.typeID,
        view: document.View || undefined,
        timestamp: Date.now() + VALIDITY,
        lastUpdated: firstContentDocument.lastUpdated
    });
};

const getAll = async (persistence) => {
    const pathAliasEntity = await getPathAliasEntity();
    const reverseAliasAssociation = getReverseAliasAssociation(pathAliasEntity);

    const pathAliasDocuments = await pathAliasEntity.getDocuments(persistence);

    return Promise.map(
        pathAliasDocuments.filter((doc) => !doc.URL),
        async (doc) => {
            const aliasInfo = await getAliasInfo(persistence, reverseAliasAssociation, doc);
            return Object.freeze({
                ...aliasInfo,
                url: `/${doc.Name}`
            });
        }
    );
};

const update = async (path) => {
    if (!pathAliasEntity) {
        pathAliasEntity = await getPathAliasEntity();

        // Find the reverse relationship for Content/Alias
        reverseAliasAssociation = getReverseAliasAssociation(pathAliasEntity);
    }

    if (reverseAliasAssociation) {
        const persistence = serverUtils.getPersistence();
        try {
            const pathAliases = await pathAliasEntity.getDocuments(persistence, { Name: path });
            if (!pathAliases || !pathAliases.length) {
                return null;
            }

            const pathAlias = pathAliases[0];

            cache[path] = await getAliasInfo(persistence, reverseAliasAssociation, pathAlias);

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
    getAll: async (persistence) => getAll(persistence),
    remove: (path) => {
        delete cache[path];
    }
});
