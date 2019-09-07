const warpjsUtils = require('@warp-works/warpjs-utils');

const { DEFAULT_VERSION } = require('./../../../lib/constants');
const convertDocumentToTree = require('./convert-document-to-tree');
const convertImageToPdfmake = require('./convert-image-to-pdfmake');
// const debug = require('./debug')('extract-document');
const Document = require('./../../../lib/core/first-class/document');
const extractCommunity = require('./extract-community');
const extractGroups = require('./extract-groups');
const extractOverview = require('./extract-overview');
const generateTocNumbers = require('./generate-toc-numbers');
const serverUtils = require('./../../utils');

module.exports = async (req, persistence, type, id, viewName, level = 0) => {
    const entity = await serverUtils.getEntity(null, type);
    const document = await entity.getInstance(persistence, id);

    if (!document.id) {
        throw new warpjsUtils.WarpJSError(`Invalid document '${type}' with id='${id}'.`);
    }

    const isVisible = await Document.isVisible(persistence, entity, document, req.warpjsUser);
    if (!isVisible) {
        return null;
    }

    const resource = warpjsUtils.createResource(req, {
        type: document.type,
        typeID: document.typeID || entity.id,
        id: document.id,
        name: document.Name,
        version: document.Version || DEFAULT_VERSION,
        lastUpdated: document.lastUpdated,
        status: document.Status,
        description: document.Description,
        keywords: document.Keywords,
        author: await Document.getAuthors(persistence, entity, document),
        releaseDate: document.ReleaseDate
    }, req);

    if (!level) {
        // Add links only for top document.
        resource.link('home', {
            title: "Home",
            href: warpjsUtils.fullUrl(req, '/')
        });

        // Find the cover image only for top document.
        const imagesRelationship = entity.getRelationshipByName('Images');
        if (imagesRelationship) {
            const imageDocuments = await imagesRelationship.getDocuments(persistence, document);
            const pdfCoverImageDocument = imageDocuments.find((imageDocument) => imageDocument.Type === 'PdfCoverImage');
            if (pdfCoverImageDocument && pdfCoverImageDocument.ImageURL) {
                resource.PdfCoverImage = await convertImageToPdfmake(pdfCoverImageDocument.ImageURL);
            }
        }
    }

    const overview = await extractOverview(req, persistence, entity, document, viewName, level);
    resource.embed('items', overview);

    // Only keep the community at the first level.
    if (!level) {
        // debug(`overview=`, overview);

        const editorResources = await extractCommunity(req, persistence, entity, document, 'Editors');
        if (editorResources) {
            resource.embed('editors', editorResources);
        }

        const authorsResource = await extractCommunity(req, persistence, entity, document, 'Authors');
        if (authorsResource) {
            resource.embed('authors', authorsResource);
        }

        const contributorsResource = await extractCommunity(req, persistence, entity, document, 'Contributors');
        if (contributorsResource) {
            resource.embed('contributors', contributorsResource);
        }

        const workGroups = await extractGroups(req, persistence, entity, document, 'WorkGroups');
        if (workGroups) {
            resource.embed('workGroups', workGroups);
        }

        const taskGroups = await extractGroups(req, persistence, entity, document, 'TaskGroups');
        if (taskGroups) {
            resource.embed('taskGroups', taskGroups);
        }

        // If no specific PDF cover image specified, check overview.
        if (!resource.PdfCoverImage && overview.length) {
            const firstParagraph = overview[0];
            if (firstParagraph._embedded && firstParagraph._embedded.images && firstParagraph._embedded.images.length) {
                const firstImage = firstParagraph._embedded.images[0];
                if (firstImage.base64) {
                    resource.PdfCoverImage = firstImage.base64;
                }
            }
        }

        const newResource = convertDocumentToTree(resource);
        generateTocNumbers(newResource);
        return newResource;
    }

    return resource;
};
