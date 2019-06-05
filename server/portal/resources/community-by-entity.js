const warpjsUtils = require('@warp-works/warpjs-utils');

// const debug = require('./debug')('community-by-entity');
const usersByRelationship = require('./users-by-relationship');

const embed = async (persistence, entity, instance, resource, relationshipName, embedName) => {
    const relationship = entity.getRelationshipByName(relationshipName);
    if (!relationship) {
        return;
    }

    const documents = await usersByRelationship(persistence, relationship, instance);
    if (documents && documents.length) {
        resource.showPanel = true;
        resource.embed(embedName, documents);
    }
};

module.exports = async (persistence, entity, instance) => {
    const resource = warpjsUtils.createResource('', {
    });

    await embed(persistence, entity, instance, resource, 'Editors', 'editors');
    await embed(persistence, entity, instance, resource, 'Authors', 'authors');
    await embed(persistence, entity, instance, resource, 'Contributors', 'contributors');

    return resource;
};
