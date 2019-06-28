const { JSDOM } = require('jsdom');
const htmlToPdfmake = require('html-to-pdfmake');

const pageSize = require('./page-size');

const constants = require('./../constants');
// const debug = require('./debug')('item-element');

const heading = (resource, docDefinition, headlineLevel) => {
    const headlineContent = [{
        id: `heading-${resource.tocNumber}`,
        text: `${resource.tocNumber} ${resource.heading || resource.name}`,
        headlineLevel,
        style: (headlineLevel === 1) ? 'headline1' : (headlineLevel === 2) ? 'headline2' : 'headline',
        pageBreak: (headlineLevel === 1) ? 'before' : null,

        tocItem: constants.TOC_NAME,
        tocStyle: (headlineLevel === 1) ? 'toc1' : 'toc2',
        tocNumberStyle: (headlineLevel === 1) ? 'toc1_number' : 'toc2_number',
        tocMargin: [ ((headlineLevel - 1) * 20), headlineLevel === 1 ? 10 : 5, 0, 0 ]
    }];

    return headlineContent;
};

const itemElement = (resource, docDefinition, headlineLevel = 1) => {
    const { width, height } = pageSize(docDefinition);

    try {
        let elements = [];

        if (resource.type === constants.TYPES.PARAGRAPH) {
            if (resource.heading) {
                elements.push(heading(resource, docDefinition, headlineLevel));
            }

            if (resource._embedded && resource._embedded.images && resource._embedded.images.length) {
                const maxImageWidth = width - (2 * constants.PAGE_MARGIN_SIDE);
                const maxImageHeight = maxImageWidth;

                const image = resource._embedded.images[0];
                elements.push({
                    image: image.base64,
                    fit: [ maxImageWidth, maxImageHeight ],
                    alignment: 'center'
                });

                if (image.caption) {
                    elements.push({
                        text: image.caption,
                        style: 'imageCaption',
                        tocItem: constants.IMAGE_TOC_NAME,
                        tocStyle: {
                            fontSize: constants.DEFAULT_TOC_FONT_SIZE,
                            lineHeight: 1
                        },
                        tocNumberStyle: {
                            fontSize: constants.DEFAULT_TOC_FONT_SIZE,
                            lineHeight: 1
                        },
                        tocMargin: [ 0, 0, 0, 0 ],
                    });
                }

                // Some padding below an image.
                elements.push({
                    text: '',
                    margin: [ 0, 0, 0, 24 ]
                });
            }

            if (resource.content) {
                const jsdomWindow = (new JSDOM('')).window;
                const converted = htmlToPdfmake(resource.content, jsdomWindow);

                // Let's separate the paragraph (double '\n') into their own.
                // Abuse of `.reduce` to keep current value.
                converted.reduce(
                    (memo, segment, index, array) => {
                        if (segment === '\n') {
                            if (memo.length) {
                                // Something was added in before, so add it to
                                // the elements.
                                elements.push({
                                    text: memo,
                                    style: 'paragraph'
                                });
                            }
                            return [];
                        } else if (index === array.length - 1) {
                            // Last element, so we need to add it.
                            memo.push(segment);
                            elements.push({
                                text: memo,
                                style: 'paragraph'
                            });
                        } else {
                            return memo.concat(segment);
                        }
                    },
                    []
                );
            }

            if (resource._embedded && resource._embedded.items && resource._embedded.items.length) {
                resource._embedded.items.forEach((subItem) => {
                    elements = elements.concat(itemElement(subItem, docDefinition, headlineLevel + 1));
                });
            }
        } else {
            // This is a document.
            if (resource && resource._embedded && resource._embedded.items && resource._embedded.items.length) {
                elements.push(heading(resource, docDefinition, headlineLevel));

                resource._embedded.items.forEach((subItem) => {
                    elements = elements.concat(itemElement(subItem, docDefinition, headlineLevel + 1));
                });
            }
        }

        return elements;
    } catch (err) {
        // eslint-disable-next-line no-console
        console.error(`item ERROR:`, err);
    }
};

module.exports = itemElement;
