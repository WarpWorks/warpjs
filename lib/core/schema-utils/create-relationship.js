/**
 *  Creates an association on the level 1 documents.
 *
 *  The `changeToMake` format is:
 *
 *      {
 *          type: <One of ComplexTypes.*>,
 *          name: 'Name of the new association',
 *          target: 'Target entity name',
 *          readOnly: true|false,
 *          sourceEntity: 'Source entity name',
 *          desc: "Association description",
 *          label: "Association label",
 *          reverseDesc: "Reverse association description",
 *          reverseLabel: "Reverse association label",
 *          panel: "What panel to add relationship to",
            style: "What style to display on the panel"
 *      }
 */

const createNewID = require('./create-new-id');
const getEntityDocument = require('./get-entity-document');

module.exports = async (DOMAIN, persistence, changeToMake) => {
    const warpCore = require('./../index');

    const coreDomain = await warpCore.getCoreDomain();

    // Entities
    const entityEntity = coreDomain.getEntityByName('Entity');
    const relationshipEntity = coreDomain.getEntityByName('Relationship');

    // Relationships
    const relationshipRelationship = entityEntity.getRelationshipByName('relationships');

    const sourceDocument = await getEntityDocument(persistence, entityEntity, changeToMake.sourceEntity);

    const relationshipDocuments = await relationshipRelationship.getDocuments(persistence, sourceDocument);

    // Check if association exists.
    let foundRelationship = relationshipDocuments.find((contentRelationshipDocument) => contentRelationshipDocument.name === changeToMake.name);
    if (!foundRelationship) {
        const relationshipTarget = await getEntityDocument(persistence, entityEntity, changeToMake.target);

        const newRelationship = entityEntity.createChildForInstance(sourceDocument, relationshipRelationship, await createNewID(DOMAIN));
        newRelationship.name = changeToMake.name;
        newRelationship.desc = `Relationship created by migration script`;
        newRelationship.label = changeToMake.name;
        newRelationship.isAggregation = changeToMake.isAggregation;
        newRelationship.targetEntity = relationshipTarget.warpjsId;

        foundRelationship = await relationshipEntity.createDocument(persistence, newRelationship);
    }
    changeToMake.warpjsId = foundRelationship.warpjsId;

    // Check if reverse assocation exists.
    const targetDocument = await getEntityDocument(persistence, entityEntity, changeToMake.target);
    const reverseRelationshipName = relationshipRelationship.generateReverseName(foundRelationship.warpjsId);
    const reverseRelationshipDocuments = await relationshipRelationship.getDocuments(persistence, targetDocument);
    const foundReverseRelationship = reverseRelationshipDocuments.find((reverseRelationshipDocument) => reverseRelationshipDocument.name === reverseRelationshipName);
    if (!foundReverseRelationship) {
        const newReverseRelationship = entityEntity.createChildForInstance(targetDocument, relationshipRelationship, await createNewID(DOMAIN));
        newReverseRelationship.name = reverseRelationshipName;
        newReverseRelationship.desc = changeToMake.reverseDesc || `Reverse relationship created by migration script`;
        newReverseRelationship.label = changeToMake.reverseLabel || `Ref ${foundRelationship.name}@${sourceDocument.name}`;
        newReverseRelationship.isAggregation = changeToMake.isAggregation;
        newReverseRelationship.targetEntity = sourceDocument.warpjsId;
        await relationshipEntity.createDocument(persistence, newReverseRelationship);
    }

    return foundRelationship;
};
