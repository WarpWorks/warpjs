const Promise = require('bluebird');

const warpjsUtils = require('@warp-works/warpjs-utils');

const Documents = require('./../../../lib/core/first-class/documents');

const convertImageToPdfmake = require('./convert-image-to-pdfmake');
const debug = require('./debug')('extract-overview');
const convertInternalLinks = require('./convert-internal-links');
const isParagraphVisible = require('./is-paragraph-visible');

module.exports = async (req, persistence, entity, document, viewName, level = 0) => {
    debug(`level=${level}...id=${document.id}/type=${document.type}/view=${viewName || ''}`);
    const overviewRelationship = entity.getRelationshipByName('Overview');
    const paragraphs = await overviewRelationship.getDocuments(persistence, document);

    const paragraphEntity = overviewRelationship.getTargetEntity();
    const imagesRelationship = paragraphEntity.getRelationshipByName('Images');

    // debug(`paragraphs=`, paragraphs);

    const visibleParagraphs = paragraphs.filter(isParagraphVisible);

    return Promise.map(
        visibleParagraphs,
        async (paragraph, index) => {
            debug(`level=${level}...id=${document.id}/type=${document.type}/view=${viewName || ''}/paragraph=${index}: headingLevel=${paragraph.HeadingLevel}/heading=${paragraph.Heading}`);
            const content = await convertInternalLinks(persistence, entity.getDomain(), paragraph.Content);
            const resource = warpjsUtils.createResource('', {
                type: paragraph.type,
                id: paragraph._id,
                position: paragraph.Position,
                headingLevel: paragraph.HeadingLevel || 'H1',
                heading: paragraph.Heading,
                content,
                visibility: paragraph.Visibility || 'WebAndPDF'
            });

            // Extract first image if any.
            // const images = await imagesRelationship.getDocuments(persistence, paragraph);
            // if (images && images.length && images[0].ImageURL) {
            //     debug(`level=${level}...id=${document.id}/type=${document.type}/view=${viewName || ''}/paragraph=${index}: found image`);
            //     const image = images[0];

            //     const imageResource = warpjsUtils.createResource(image.ImageURL, {
            //         type: image.type,
            //         id: image._id,
            //         url: image.ImageURL,
            //         width: image.Width,
            //         height: image.Height,
            //         caption: image.Caption
            //     }, req);

            //     resource.embed('images', imageResource);

            //     imageResource.base64 = await convertImageToPdfmake(image.ImageURL);
            // };

            if (paragraph.SubDocuments && paragraph.SubDocuments !== '-1') {
                debug(`level=${level}...id=${document.id}/type=${document.type}/view=${viewName || ''}/paragraph=${index}: found SubDocuments=${paragraph.SubDocuments}`);
                const extractDocument = require('./extract-document');

                const subDocumentRelationship = entity.getRelationshipById(paragraph.SubDocuments);
                if (subDocumentRelationship) {
                    debug(`level=${level}...id=${document.id}/type=${document.type}/view=${viewName || ''}/paragraph=${index}: found subDocumentRelationship=${subDocumentRelationship.name}`);
                    const subDocuments = await subDocumentRelationship.getDocuments(persistence, document);
                    debug(`level=${level}...id=${document.id}/type=${document.type}/view=${viewName || ''}/paragraph=${index}: found subDocuments:${subDocuments.length}`);
                    const bestSubDocuments = await Documents.bestDocuments(persistence, subDocumentRelationship.getDomain(), subDocuments);

                    const subDocumentResources = await Promise.map(
                        bestSubDocuments,
                        async (subDocument, subDocumentIndex) => {
                            debug(`level=${level}...id=${document.id}/type=${document.type}/view=${viewName || ''}/paragraph=${index}:     subDocumentIndex=${subDocumentIndex}`);
                            return extractDocument(req, persistence, subDocument.type, subDocument.id, viewName, level + 1);
                        },
                        { concurrency: 1 }
                    );
                    debug(`subDocuments=`, subDocumentResources.map((r) => r.name));
                    resource.embed('items', subDocumentResources);
                } else {
                    // eslint-disable-next-line no-console
                    console.error(`Invalid paragraph.SubDocuments='${paragraph.SubDocuments}'.`);
                }
            }

            return resource;
        },
        { concurrency: 1 }
    );
};
