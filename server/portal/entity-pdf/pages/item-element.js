const { JSDOM } = require('jsdom');
const htmlToPdfmake = require('html-to-pdfmake');

const { DEFAULT_FONT_SIZE, DEFAULT_TOC_FONT_SIZE, FONT_SIZE, IMAGE_TOC_NAME, LINE_COLOR, PAGE_MARGIN_SIDE, TOC_FONT_SIZE, TOC_NAME, TYPES } = require('./../constants');
const pageSize = require('./page-size');
// const debug = require('./debug')('item-element');

const heading = (resource, docDefinition, headlineLevel) => {
    const fontSize = FONT_SIZE[headlineLevel] || DEFAULT_FONT_SIZE;

    const headlineContent = [{
        id: `heading-${resource.tocNumber}`,
        text: `${resource.tocNumber} ${resource.heading || resource.name}`,
        headlineLevel,
        bold: true,
        fontSize,
        margin: [ 0, fontSize, 0, headlineLevel === 1 ? 0 : fontSize / 2 ],
        pageBreak: (headlineLevel === 1) ? 'before' : null,

        tocItem: TOC_NAME,
        tocStyle: {
            bold: headlineLevel <= 2,
            fontSize: TOC_FONT_SIZE[headlineLevel] || DEFAULT_TOC_FONT_SIZE
        },
        tocNumberStyle: {
            bold: headlineLevel <= 2,
            fontSize: TOC_FONT_SIZE[headlineLevel] || DEFAULT_TOC_FONT_SIZE
        },
        tocMargin: [ ((headlineLevel - 1) * 20), headlineLevel === 1 ? 10 : 5, 0, 0 ]
    }];

    // TODO: Add a line if headlineLevel === 1.
    if (headlineLevel === 1) {
        const { width } = pageSize(docDefinition);
        headlineContent.push({
            canvas: [{
                type: 'line',
                x1: 0,
                y1: 0,
                x2: width - (2 * PAGE_MARGIN_SIDE),
                y2: 0,
                lineWidth: 0.5,
                lineColor: LINE_COLOR
            }],
            margin: [ 0, 0, 0, fontSize / 2 ]
        });
    }

    return headlineContent;
};

const itemElement = (resource, docDefinition, headlineLevel = 1) => {
    try {
        let elements = [];

        if (resource.type === TYPES.PARAGRAPH) {
            if (resource.heading) {
                elements.push(heading(resource, docDefinition, headlineLevel));
            }

            if (resource._embedded && resource._embedded.images && resource._embedded.images.length) {
                const image = resource._embedded.images[0];
                elements.push({
                    image: image.base64,
                    fit: [400, 300],
                    alignment: 'center'
                });

                if (image.caption) {
                    elements.push({
                        text: image.caption,
                        tocItem: IMAGE_TOC_NAME,
                        tocStyle: {
                            fontSize: DEFAULT_TOC_FONT_SIZE,
                            lineHeight: 1
                        },
                        tocNumberStyle: {
                            fontSize: DEFAULT_TOC_FONT_SIZE,
                            lineHeight: 1
                        },
                        tocMargin: [ 0, 0, 0, 0 ],
                        alignment: 'center'
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
