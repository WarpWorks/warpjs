const createNewID = require('@warp-works/warpjs/lib/core/schema-utils/create-new-id');
const DocLevel = require('@warp-works/warpjs/lib/doc-level');

module.exports = async (DOMAIN, persistence, changesToMake) => {
    const warpCore = require('./../index');
    const coreDomain = await warpCore.getCoreDomain();
    const entityEntity = await coreDomain.getEntityByName('Domain');
    const domainDocument = await entityEntity.getDocuments(persistence, { name: DOMAIN });

    const relationshipModel = await entityEntity.getRelationshipByName('entities');
    const targetEntity = relationshipModel.getTargetEntity();
    let elements = await targetEntity.getDocuments(persistence, { name: changesToMake.name });

    if (!elements.length) {
        const domainInstance = domainDocument[0];
        const child = await entityEntity.createChildForInstance(
            domainInstance,
            relationshipModel,
            await createNewID(DOMAIN)
        );
        child.name = changesToMake.name;
        child.desc = changesToMake.desc;
        child.label = changesToMake.label;

        await targetEntity.createDocument(persistence, child);
        await entityEntity.updateDocument(persistence, domainInstance, false);
    }

    // add Content parentClass relationship
    elements = await targetEntity.getDocuments(persistence, { name: changesToMake.name });
    const instance = elements[0];
    const parentClassRelationship = await targetEntity.getRelationshipByName('parentClass');
    const parentEntity = parentClassRelationship.getTargetEntity();
    const parentDocument = await parentEntity.getDocuments(persistence, { name: changesToMake.parent });
    const parentInstance = parentDocument[0];
    const docLevelString = 'Relationship:parentClass.Entity:' + parentInstance.warpjsId;
    const docLevel = DocLevel.fromString(docLevelString);
    const docLevelData = await docLevel.getData(persistence, parentEntity, instance);
    await docLevelData.model.addValue(persistence, 'Content', parentInstance.warpjsId, instance);
    await parentEntity.updateDocument(persistence, instance, false);

    return instance;
};
