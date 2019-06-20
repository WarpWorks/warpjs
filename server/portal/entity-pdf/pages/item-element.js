const { JSDOM } = require('jsdom');
const htmlToPdfmake = require('html-to-pdfmake');

const { DEFAULT_FONT_SIZE, DEFAULT_TOC_FONT_SIZE, FONT_SIZE, TOC_FONT_SIZE, TOC_NAME, TYPES } = require('./../constants');
const debug = require('./debug')('item-element');

const heading = (resource, headlineLevel) => {
    const fontSize = FONT_SIZE[headlineLevel] || DEFAULT_FONT_SIZE;

    return {
        id: `heading-${resource.tocNumber}`,
        text: `${resource.tocNumber} ${resource.heading || resource.name}`,
        headlineLevel,
        bold: true,
        fontSize,
        margin: [ 0, fontSize, 0, fontSize / 2 ],
        pageBreak: (headlineLevel === 1) ? 'before' : null,

        tocItem: TOC_NAME,
        tocStyle: {
            bold: headlineLevel <= 2,
            fontSize: TOC_FONT_SIZE[headlineLevel] || DEFAULT_TOC_FONT_SIZE,
        },
        tocNumberStyle: {
            bold: headlineLevel <= 2,
            fontSize: TOC_FONT_SIZE[headlineLevel] || DEFAULT_TOC_FONT_SIZE,
        },
        tocMargin: [ ((headlineLevel - 1) * 20), headlineLevel === 1 ? 10 : 5, 0, 0 ],
    };
};


const itemElement = (resource, headlineLevel = 1) => {
    try {
        let elements = [];

        if (resource.type === TYPES.PARAGRAPH) {
            if (resource.heading) {
                elements.push(heading(resource, headlineLevel));
            }

            if (resource.content) {
                const jsdomWindow = (new JSDOM('')).window;
                const converted = htmlToPdfmake(resource.content, jsdomWindow);
                elements.push({
                    text: converted
                });
            }

            if (resource._embedded && resource._embedded.items && resource._embedded.items.length) {
                resource._embedded.items.forEach((subItem) => {
                    elements = elements.concat(itemElement(subItem, headlineLevel + 1));
                });
            }
        } else {
            // This is a document.
            if (resource && resource._embedded && resource._embedded.items && resource._embedded.items.length) {
                elements.push(heading(resource, headlineLevel));

                resource._embedded.items.forEach((subItem) => {
                    elements = elements.concat(itemElement(subItem, headlineLevel + 1));
                });
            }
        }

        return elements;
    } catch (err) {
        console.error(`item ERROR:`, err);
    }
};

module.exports = itemElement;
