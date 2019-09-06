const { JSDOM } = require('jsdom');
const htmlToPdfmake = require('html-to-pdfmake');

const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const pageSize = require('./page-size');
const constants = require('./../constants');
const CONTENT_LINK_RE = require('./../../../../lib/core/content-link-re');

// const debug = require('./debug')('item-element');

const heading = (resource, docDefinition, headlineLevel) => {
    // debug(`heading(): resource.heading='${resource.heading}'`);
    if (resource.tocNumber) {
        return [{
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
    } else {
        return [];
    }
};

const contentExternalLinkReplacer = () => {
    const icon = String.fromCharCode(0xe135);

    return `<a class="icon">${icon}</a></a>`;
};

const itemElement = (resource, docDefinition, headlineLevel = 1, req) => {
    // const { width, height } = pageSize(docDefinition);
    const { width } = pageSize(docDefinition);
    const contentLinkReplacer = (match, label, type, id) => {
        const icon = String.fromCharCode(0xe144);

        const href = (type === constants.CONVERTED_CUSTOM_LINK)
            ? id
            : RoutesInfo.expand('entity', { type, id }, req)
        ;

        const fullUrl = warpjsUtils.fullUrl(req, href);

        return `<a href="${fullUrl}">${label}<a class="icon">${icon}</a></a>`;
    };

    try {
        let elements = [];

        if (resource.type === constants.TYPES.PARAGRAPH) {
            if (resource.heading) {
                // debug(`resource.heading=`, resource.heading);
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
                            lineHeight: 1,
                            font: 'Helvetica'
                        },
                        tocNumberStyle: {
                            fontSize: constants.DEFAULT_TOC_FONT_SIZE,
                            lineHeight: 1,
                            font: 'Helvetica'
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

                if (resource.content && typeof resource.content === 'string') {
                    resource.content = resource.content.replace(/<\/a>/g, contentExternalLinkReplacer);
                    resource.content = resource.content.replace(CONTENT_LINK_RE, contentLinkReplacer);
                }
                const converted = htmlToPdfmake(resource.content, jsdomWindow);

                const convertLists = (listItems) => {
                    const listElements = [];
                    listItems.forEach((listItem) => {
                        if (listItem.stack) {
                            const listStack = [];
                            listItem.stack.reduce((memo, stackItem, index, array) => {
                                if (stackItem.table) {
                                    if (memo.length) {
                                        listStack.push({
                                            text: memo,
                                            marginLeft: 5
                                        });
                                    }
                                    listStack.push(stackItem);

                                    return [];
                                } else if (stackItem.ul || stackItem.ol) {
                                    const listType = stackItem.ul ? 'ul' : 'ol';
                                    stackItem[listType] = convertLists(stackItem[listType]);
                                    if (memo.length) {
                                        listStack.push({
                                            text: memo,
                                            marginLeft: 5
                                        });
                                    }

                                    listStack.push(stackItem);

                                    return [];
                                } else if (index === array.length - 1) {
                                    stackItem.marginLeft = null;
                                    memo.push(stackItem);
                                    listStack.push({
                                        text: memo,
                                        marginLeft: 5
                                    });
                                } else {
                                    stackItem.marginLeft = null;

                                    return memo.concat(stackItem);
                                }
                            }, []);
                            listElements.push(listStack);
                        } else {
                            listElements.push(listItem);
                        }
                    });

                    return listElements;
                };

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
                        } else if (segment.table) {
                            segment.table.widths = [];
                            for (let i = 0; i < segment.table.body[0].length; i++) {
                                segment.table.widths.push('*');
                            }
                            if (memo.length) {
                                elements.push({
                                    text: memo,
                                    style: 'paragraph'
                                });
                            }
                            elements.push(segment);

                            return [];
                        } else if (segment.ul || segment.ol) {
                            const listType = segment.ul ? 'ul' : 'ol';
                            segment[listType] = convertLists(segment[listType]);
                            if (memo.length) {
                                elements.push({
                                    text: memo,
                                    style: 'paragraph'
                                });
                            }
                            elements.push({
                                stack: [ segment ],
                                style: 'paragraph'
                            });

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
                    elements = elements.concat(itemElement(subItem, docDefinition, headlineLevel + 1, req));
                });
            }
        } else {
            // This is a document.
            if (resource && resource._embedded && resource._embedded.items && resource._embedded.items.length) {
                elements.push(heading(resource, docDefinition, headlineLevel));

                resource._embedded.items.forEach((subItem) => {
                    elements = elements.concat(itemElement(subItem, docDefinition, headlineLevel + 1, req));
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
