const Promise = require('bluebird');

const warpjsUtils = require('@warp-works/warpjs-utils');

const previewByEntity = require('./preview-by-entity');

// const debug = require('./debug')('sub-documents-by-paragraph');

module.exports = async (persistence, domain, documentJson, paragraphJson) => {
    // debug(`documentJson=`, documentJson);
    const paragraphEntity = domain.getEntityByInstance(paragraphJson);
    const subDocumentsBasicProperty = paragraphEntity.getBasicPropertyByName('SubDocuments');
    const subDocumentsEntityId = subDocumentsBasicProperty.getValue(paragraphJson);
    // debug(`subDocumentsEntityId=`, subDocumentsEntityId);
    if (subDocumentsEntityId && subDocumentsEntityId !== '-1') {
        const relationship = domain.getElementById(subDocumentsEntityId);
        const targetDocuments = await relationship.getDocuments(persistence, documentJson);
        // debug(`targetDocuments=`, targetDocuments);

        const resources = await Promise.map(
            targetDocuments,
            async (targetDocument) => {
                const targetEntity = domain.getEntityByInstance(targetDocument);
                const resource = await previewByEntity(persistence, targetEntity, targetDocument);
                return resource;
            }
        );

        if (resources && resources.length) {
            const resource = warpjsUtils.createResource('', {
                type: relationship.type,
                id: relationship.id,
                name: relationship.name,
                label: relationship.label || relationship.name
            });

            resource.embed('items', resources);
            return resource;
        } else {
            return null;
        }
    }
};
