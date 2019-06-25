const imageToBase64 = require('image-to-base64');
const mimeTypes = require('mime-types');
const path = require('path');

const { PAGE_MARGIN } = require('./../constants');
const debug = require('./debug')('cover-page');
const oxfordComma = require('./../../../../lib/utils/oxford-comma');
const pageSize = require('./page-size');
const serverUtils = require('./../../../utils');

const config = serverUtils.getConfig();

let defaultCoverImage;
let coverLogo;

module.exports = async (documentResource, docDefinition) => {
    const nodes = [];

    const { width, height } = pageSize(docDefinition);

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
        image: coverLogo,
        alignment: 'left',
        fit: [ 100, 100 ]
    });

    // Document title
    nodes.push({
        text: documentResource.name,
        fontSize: 28,
        bold: false,
        alignment: 'left',
        marginTop: 20
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
                    marginTop: 20
                });
            }
        };
    }

    // Contributors
    debug(`documentResource=`, documentResource);
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
                    marginTop: 8
                });
            }
        }
    }

    // Red block
    nodes.push({
        absolutePosition: { x: 0, y: height / 2 + PAGE_MARGIN },
        canvas: [{
            type: 'rect',
            x: 0,
            y: 0,
            w: width,
            h: height / 2 - PAGE_MARGIN + 1, // +1 just in case of missing decimal.
            color: '#dd2b0d'
        }]
    });

    // Cover image
    if (!defaultCoverImage) {
        try {
            const imageFilePath = path.join(config.folders.w2projects, config.pdfExport.coverImage);
            const base64 = await imageToBase64(imageFilePath);
            const mime = mimeTypes.lookup(imageFilePath);
            defaultCoverImage = `data:${mime};base64,${base64}`;

            nodes.push({
                absolutePosition: { x: PAGE_MARGIN, y: height / 2 + PAGE_MARGIN - 20},
                image: defaultCoverImage,
                width: Math.min(width - (2 * PAGE_MARGIN), 500),
                height: Math.min(height / 2 - 2 * PAGE_MARGIN, 360)
            });
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error(`Error getting defaultCoverImage:`, err);
        }
    };

    return nodes;
};
