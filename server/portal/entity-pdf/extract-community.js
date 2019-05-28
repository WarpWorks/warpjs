const warpjsUtils = require('@warp-works/warpjs-utils');

const constants = require('./constants');
const usersByRelationship = require('./../resources/users-by-relationship');

module.exports = async (req, persistence, entity, document, relationshipName) => {
    const relationship = entity.getRelationshipByName(relationshipName);
    const resources = await usersByRelationship(persistence, relationship, document);
    if (resources && resources.length) {
        const communityResource = warpjsUtils.createResource('', {
            type: constants.TYPES.COMMUNITY,
            id: `${document.id}-${relationshipName}`,
            name: relationshipName
        });
        communityResource.embed('items', resources);
        return communityResource;
    }
};
