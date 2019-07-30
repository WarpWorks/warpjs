const semver = require('semver');

const { DEFAULT_VERSION } = require('./../../../lib/constants');
// const debug = require('./debug')('aliases');
const serverUtils = require('./../../../server/utils');

const VALIDITY = 5 * 60 * 1000;

const STATUS_RANKS = Object.freeze({
    Approved: 1,
    IndividualContribution: 2,
    Proposal: 3,
    Draft: 4,
    Retired: 5,
    Declined: 6,
    InheritFromParent: 7,
    undefined: 8,
    DEFAULT: 100
});

const cache = {};

let pathAliasEntity;
let reverseAliasAssociation;

const byStatusAndVersion = (a, b) => {
    if (a.Status === b.Status) {
        const aSemver = semver.coerce(a.Version);
        const aVersion = aSemver ? aSemver.version : semver.coerce(DEFAULT_VERSION).version;
        const bSemver = semver.coerce(b.Version);
        const bVersion = bSemver ? bSemver.version : semver.coerce(DEFAULT_VERSION).version;

        return semver.lt(aVersion, bVersion) ? 1
            : semver.gt(aVersion, bVersion) ? -1
            : 0;
    } else {
        const aStatusRank = STATUS_RANKS[a.Status] || STATUS_RANKS.DEFAULT;
        const bStatusRank = STATUS_RANKS[b.Status] || STATUS_RANKS.DEFAULT;
        return aStatusRank - bStatusRank;
    }
};

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

            const contentDocuments = await reverseAliasAssociation.getDocuments(persistence, pathAlias);

            contentDocuments.sort(byStatusAndVersion);

            const firstContentDocument = contentDocuments[0];
            cache[path] = Object.freeze({
                id: firstContentDocument.id,
                type: firstContentDocument.type,
                typeID: firstContentDocument.typeID,
                view: pathAlias.View || undefined,
                timestamp: Date.now() + VALIDITY
            });

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
    get: async (path) => get(path)
});
