const Promise = require('bluebird');

const warpjsUtils = require('@warp-works/warpjs-utils');

// const debug = require('./debug')('extract-overview');
const isParagraphVisible = require('./is-paragraph-visible');

module.exports = async (req, persistence, entity, document, viewName, level = 0) => {
    const overviewRelationship = entity.getRelationshipByName('Overview');
    const paragraphs = await overviewRelationship.getDocuments(persistence, document);
    const visibleParagraphs = paragraphs.filter(isParagraphVisible);

    return Promise.map(
        visibleParagraphs,
        async (paragraph) => {
            const resource = warpjsUtils.createResource('', {
                type: paragraph.type,
                id: paragraph._id,
                position: paragraph.Position,
                headingLevel: paragraph.HeadingLevel || 'H1',
                heading: paragraph.Heading,
                content: paragraph.Content
            });

            if (paragraph.SubDocuments) {
                const extractDocument = require('./extract-document');

                const subDocumentRelationship = entity.getRelationshipById(paragraph.SubDocuments);
                const subDocuments = await subDocumentRelationship.getDocuments(persistence, document);
                const subDocumentResources = await Promise.map(
                    subDocuments,
                    async (subDocument) => extractDocument(req, persistence, subDocument.type, subDocument.id, viewName, level + 1)
                );
                resource.embed('items', subDocumentResources);
            }

            return resource;
        }
    );
};
