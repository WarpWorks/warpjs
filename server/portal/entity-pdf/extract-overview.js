const imageToBase64 = require('image-to-base64');
const mimeTypes = require('mime-types');
const path = require('path');
const Promise = require('bluebird');

const warpjsUtils = require('@warp-works/warpjs-utils');

const serverUtils = require('./../../utils');
// const debug = require('./debug')('extract-overview');
const isParagraphVisible = require('./is-paragraph-visible');

const config = serverUtils.getConfig();

module.exports = async (req, persistence, entity, document, viewName, level = 0) => {
    const overviewRelationship = entity.getRelationshipByName('Overview');
    const paragraphs = await overviewRelationship.getDocuments(persistence, document);

    const paragraphEntity = overviewRelationship.getTargetEntity();
    const imagesRelationship = paragraphEntity.getRelationshipByName('Images');

    // debug(`paragraphs=`, paragraphs);

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
                content: paragraph.Content,
                visibility: paragraph.Visibility || 'WebAndPDF'
            });

            // Extract first image if any.
            const images = await imagesRelationship.getDocuments(persistence, paragraph);
            if (images && images.length && images[0].ImageURL) {
                const image = images[0];

                const imageResource = warpjsUtils.createResource(image.ImageURL, {
                    type: image.type,
                    id: image._id,
                    url: image.ImageURL,
                    width: image.Width,
                    height: image.Height,
                    caption: image.Caption
                }, req);

                resource.embed('images', imageResource);

                try {
                    // Image are now on local disk, so let's find it.
                    const imageFilePath = path.join(config.folders.w2projects, image.ImageURL);
                    const base64 = await imageToBase64(imageFilePath);
                    const mime = mimeTypes.lookup(imageFilePath);
                    imageResource.base64 = `data:${mime};base64,${base64}`;
                } catch (err) {
                    // eslint-disable-next-line no-console
                    console.error(`Error with imageToBase64():`, err);
                }
            };

            if (paragraph.SubDocuments) {
                const extractDocument = require('./extract-document');

                const subDocumentRelationship = entity.getRelationshipById(paragraph.SubDocuments);
                if (subDocumentRelationship) {
                    const subDocuments = await subDocumentRelationship.getDocuments(persistence, document);
                    const subDocumentResources = await Promise.map(
                        subDocuments,
                        async (subDocument) => extractDocument(req, persistence, subDocument.type, subDocument.id, viewName, level + 1)
                    );
                    resource.embed('items', subDocumentResources);
                } else {
                    // eslint-disable-next-line no-console
                    console.error(`Invalid paragraph.SubDocuments='${paragraph.SubDocuments}'.`);
                }
            }

            return resource;
        }
    );
};
