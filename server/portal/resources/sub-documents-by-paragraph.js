const Promise = require('bluebird');

const previewByEntity = require('./preview-by-entity');

// const debug = require('./debug')('sub-documents-by-paragraph');

module.exports = async (persistence, domain, documentJson, paragraphJson) => {
    const paragraphEntity = domain.getEntityByInstance(paragraphJson);
    const subDocumentsBasicProperty = paragraphEntity.getBasicPropertyByName('SubDocuments');
    const subDocumentsEntityId = subDocumentsBasicProperty.getValue(paragraphJson);
    if (subDocumentsEntityId && subDocumentsEntityId !== '-1') {
        const relationship = domain.getElementById(subDocumentsEntityId);
        const targetDocuments = await relationship.getDocuments(persistence, documentJson);
        const resources = await Promise.map(
            targetDocuments,
            async (targetDocument) => {
                const targetEntity = domain.getEntityByInstance(targetDocument);
                const resource = await previewByEntity(persistence, targetEntity, targetDocument);
                return resource;
            }
        );

        return resources;
    }
};
