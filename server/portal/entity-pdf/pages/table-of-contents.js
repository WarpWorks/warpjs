// const omit = require('lodash/omit');

const debug = require('./debug')('table-of-contents');

const { IMAGE_TOC_NAME, TOC_NAME, TYPES } = require('./../constants');

const findTocs = (memo, item) => {
    if (item.type === TYPES.PARAGRAPH) {
        // debug(`findTocs(): a paragraph: item=`, item);

        if (!memo.headings) {
            memo.headings = Boolean(item.heading);

            // Still no headings? Look for child elements.
            if (item._embedded && item._embedded.items && item._embedded.items.length) {
                // The paragraph has sub-documents, so we know there will be at
                // least a document name for the heading TOC.
                // debug(`findTocs(): item._embedded.items=`, item._embedded.items);
                memo.headings = true;
            }
        }

        if (!memo.figures) {
            if (item && item._embedded && item._embedded.images) {
                // There are some images.
                memo.figures = Boolean(item._embedded.images.find((image) => {
                    // debug(`findTocs(): figures: image=`, omit(image, [ 'base64' ]));
                    return Boolean(image.caption);
                }));
            }

            if (!memo.figures) {
                // We still have not found any images. Try child items.
                if (item && item._embedded && item._embedded.items && item._embedded.items.length) {
                    // debug(`Need to check child items for image.`);
                    return item._embedded.items.reduce(findTocs, memo);
                }
            }
        }
    } else if (item.type === TYPES.COMMUNITY) {
        debug(`findTocs(): Is community?: item=`, item);
    } else {
        // Other are documents.
        // debug(`findTocs(): Other type: item=`, item);
        if (!memo.headings) {
            // The document should have a title, but let's be sure.
            if (item.name) {
                memo.headings = true;
            }
        }

        if (!memo.figures) {
            if (item._embedded && item._embedded.items && item._embedded.items.length) {
                return item._embedded.items.reduce(findTocs, memo);
            }
        }
    }

    return memo;
};

module.exports = async (documentResource) => {
    // Because of an issue in pdfmake, we need to figure out each table of
    // content to NOT be empty.

    const tocs = documentResource._embedded.items.reduce(findTocs, {});

    const tableOfContents = [];

    if (tocs.headings) {
        tableOfContents.push({
            toc: {
                id: TOC_NAME,
                title: { text: 'Contents', style: 'headline1' }

            },
            headlineLevel: 1,
            pageBreak: 'before'
        });
    }

    if (tocs.figures) {
        tableOfContents.push({
            toc: {
                id: IMAGE_TOC_NAME,
                title: { text: 'Figures', style: 'headline1' }
            },
            margin: [ 0, 24, 0, 12 ]
        });
    }

    return tableOfContents;
};
