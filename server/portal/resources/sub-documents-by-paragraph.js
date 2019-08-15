const Promise = require('bluebird');

const Documents = require('./../../../lib/core/first-class/documents');
const previewByEntity = require('./preview-by-entity');

// const debug = require('./debug')('sub-documents-by-paragraph');

module.exports = async (persistence, domain, documentJson, paragraphJson) => {
    const paragraphEntity = domain.getEntityByInstance(paragraphJson);
    const subDocumentsBasicProperty = paragraphEntity.getBasicPropertyByName('SubDocuments');
    const subDocumentsEntityId = subDocumentsBasicProperty.getValue(paragraphJson);
    if (subDocumentsEntityId && subDocumentsEntityId !== '-1') {
        const relationship = domain.getElementById(subDocumentsEntityId);
        const targetDocuments = await relationship.getDocuments(persistence, documentJson);

        const bestDocuments = await Documents.bestDocuments(persistence, domain, targetDocuments);

        const resources = await Promise.map(
            bestDocuments,
            async (bestDocument) => {
                const bestDocumentEntity = domain.getEntityByInstance(bestDocument);

                const resource = await previewByEntity(persistence, bestDocumentEntity, bestDocument);
                return resource;
            }
        );

        return resources;
    }
};
