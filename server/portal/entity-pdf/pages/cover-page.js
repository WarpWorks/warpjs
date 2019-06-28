const imageToBase64 = require('image-to-base64');
const mimeTypes = require('mime-types');
const path = require('path');

const constants = require('./../constants');
// const debug = require('./debug')('cover-page');
const oxfordComma = require('./../../../../lib/utils/oxford-comma');
const pageSize = require('./page-size');
const serverUtils = require('./../../../utils');

const config = serverUtils.getConfig();

let defaultCoverImage;
let coverLogo;

module.exports = async (documentResource, docDefinition) => {
    const nodes = [];

    const { width, height } = pageSize(docDefinition);
    // debug(`pageSize: ${constants.DEFAULT_PAGE_SIZE}: { ${width}, ${height} }`);

    // Cover logo
    if (!coverLogo) {
        try {
            const imageFilePath = path.join(config.folders.w2projects, config.pdfExport.coverLogo);
            const base64 = await imageToBase64(imageFilePath);
            const mime = mimeTypes.lookup(imageFilePath);
            coverLogo = `data:${mime};base64,${base64}`;
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error(`Error getting logo:`, err);
        }
    }
    nodes.push({
        absolutePosition: { x: constants.PAGE_MARGIN_SIDE, y: constants.PAGE_MARGIN_TOP },
        image: coverLogo,
        alignment: 'left',
        fit: [ constants.COVER_PAGE_LOGO_MAX_HEIGHT, width - (2 * constants.PAGE_MARGIN_SIDE) ]
    });

    // Document title
    nodes.push({
        text: documentResource.name,
        style: 'coverTitle'
    });

    // Authors
    if (documentResource._embedded && documentResource._embedded.authors && documentResource._embedded.authors.length) {
        const authorsResource = documentResource._embedded.authors[0];

        if (authorsResource._embedded && authorsResource._embedded.items && authorsResource._embedded.items.length) {
            const authors = authorsResource._embedded.items.map((author) => author.label);
            const authorNames = oxfordComma(authors);
            if (authorNames) {
                nodes.push({
                    text: [{
                        text: `Author${authors.length > 1 ? 's' : ''}: `,
                        bold: true
                    }, {
                        text: authorNames
                    }],
                    style: 'coverPageText'
                });
            }
        };
    }

    // Contributors
    // debug(`documentResource=`, documentResource);
    if (documentResource._embedded && documentResource._embedded.contributors && documentResource._embedded.contributors.length) {
        const contributorsResource = documentResource._embedded.contributors[0];

        if (contributorsResource._embedded && contributorsResource._embedded.items && contributorsResource._embedded.items.length) {
            const contributors = contributorsResource._embedded.items.map((user) => user.label);
            const contributorNames = oxfordComma(contributors);
            if (contributorNames) {
                nodes.push({
                    text: [{
                        text: `Contributor${contributors.length > 1 ? 's' : ''}: `,
                        bold: true
                    }, {
                        text: contributorNames
                    }],
                    style: 'coverPageText'
                });
            }
        }
    }

    // Red block
    // debug(`Red block: { 0, ${height / 2} } - [ ${width}, ${height / 2 + 1} ]`);
    nodes.push({
        absolutePosition: { x: 0, y: height / 2 },
        canvas: [{
            type: 'rect',
            x: 0,
            y: 0,
            w: width,
            h: height / 2 + 1, // +1 just in case of missing decimal.
            color: '#dd2b0d'
        }]
    });

    // Cover image
    const ABSOLUTE_Y_IMAGE = (height / 2) - constants.COVER_PAGE_IMAGE_OFFSET;
    const MAX_IMAGE_WIDTH = width - (2 * constants.PAGE_MARGIN_SIDE);
    const MAX_IMAGE_HEIGHT = height - ABSOLUTE_Y_IMAGE - constants.PAGE_MARGIN_BOTTOM - constants.COVER_PAGE_MARGIN_BELOW_IMAGE;
    // debug(`cover image fit: { ${constants.PAGE_MARGIN_SIDE}, ${ABSOLUTE_Y_IMAGE} } - [ ${MAX_IMAGE_WIDTH}, ${MAX_IMAGE_HEIGHT} ]`);

    if (!defaultCoverImage) {
        try {
            const imageFilePath = path.join(config.folders.w2projects, config.pdfExport.coverImage);
            const base64 = await imageToBase64(imageFilePath);
            const mime = mimeTypes.lookup(imageFilePath);
            defaultCoverImage = `data:${mime};base64,${base64}`;
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error(`Error getting defaultCoverImage:`, err);
        }
    };
    nodes.push({
        absolutePosition: { x: constants.PAGE_MARGIN_SIDE, y: ABSOLUTE_Y_IMAGE },
        image: defaultCoverImage,
        fit: [ MAX_IMAGE_WIDTH, MAX_IMAGE_HEIGHT ]
    });

    return nodes;
};
