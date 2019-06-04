const createNewID = require('./create-new-id');
// const debug = require('./debug')('create-basic-property');
const getEntityDocument = require('./get-entity-document');

module.exports = async (DOMAIN, persistence, changeToMake) => {
    const warpCore = require('./../index');

    const coreDomain = await warpCore.getCoreDomain();

    // Entities
    const entityEntity = coreDomain.getEntityByName('Entity');
    const basicPropertyEntity = coreDomain.getEntityByName('BasicProperty');

    // Relationships
    const basicPropertiesRelationship = entityEntity.getRelationshipByName('basicProperties');

    const sourceDocument = await getEntityDocument(persistence, entityEntity, changeToMake.sourceEntity);

    const basicPropertyDocuments = await basicPropertiesRelationship.getDocuments(persistence, sourceDocument);

    // Check if basic property exists.
    let foundBasicProperty = basicPropertyDocuments.find((basicPropertyDocument) => basicPropertyDocument.name === changeToMake.name);
    if (!foundBasicProperty) {
        const newBasicProperty = entityEntity.createChildForInstance(sourceDocument, basicPropertiesRelationship, await createNewID(DOMAIN));
        newBasicProperty.name = changeToMake.name;
        newBasicProperty.desc = changeToMake.desc || `Created by migration script`;
        newBasicProperty.label = changeToMake.label || changeToMake.name;
        newBasicProperty.defaultValue = changeToMake.defaultValue || newBasicProperty.defaultValue;
        newBasicProperty.examples = changeToMake.examples || newBasicProperty.examples;
        newBasicProperty.propertyType = changeToMake.propertyType || newBasicProperty.propertyType;

        foundBasicProperty = await basicPropertyEntity.createDocument(persistence, newBasicProperty);
    }
    changeToMake.warpjsId = foundBasicProperty.warpjsId;

    return foundBasicProperty;
};
