const constants = require('./../constants');

// Don't understand why it doesn't work as the default style, so explicitely
// defining it here.
const DEFAULT_FONT = 'Muli';
const HEADER_FOOTER_FONT_SIZE = 8;

const HEADLINE_MARGIN_TOP = 30;
const HEADLINE_MARGIN_BOTTOM = 15;

const HEADLINE1_FONT = 'Oswald';
const HEADLINE1_FONT_SIZE = 28;
const HEADLINE1_MARGIN_BOTTOM = 40;

const HEADLINE_FONT = 'Muli';
const HEADLINE_FONT_SIZE = 14;

const PARAGRAPH_SPACING = 8;

module.exports = async (documentResource) => ({
    coverTitle: {
        font: HEADLINE1_FONT,
        fontSize: HEADLINE1_FONT_SIZE,
        color: '#000000',
        marginTop: 40,
        marginBottom: HEADLINE_MARGIN_TOP,
        lineHeight: 1
    },

    coverPageText: {
        font: DEFAULT_FONT,
        fontSize: 9,
        marginBottom: PARAGRAPH_SPACING,
        lineHeight: 1
    },

    pageHeader: {
        font: DEFAULT_FONT,
        fontSize: HEADER_FOOTER_FONT_SIZE,
        lineHeight: 1
    },

    pageFooter: {
        font: DEFAULT_FONT,
        fontSize: HEADER_FOOTER_FONT_SIZE,
        lineHeight: 1
    },

    header: {
        fontSize: 22,
        bold: true,
        marginTop: HEADLINE_MARGIN_TOP
    },
    paragraph: {
        font: DEFAULT_FONT,
        lineHeight: 1,
        marginBottom: PARAGRAPH_SPACING
    },

    imageCaption: {
        font: DEFAULT_FONT,
        fontSize: 8,
        alignment: 'left',
        marginTop: 15
    },

    headline1: {
        font: HEADLINE1_FONT,
        fontSize: HEADLINE1_FONT_SIZE,
        bold: false,
        color: '#e12726',
        marginTop: HEADLINE_MARGIN_TOP,
        marginBottom: HEADLINE1_MARGIN_BOTTOM,
        lineHeight: 1
    },

    headline2: {
        font: HEADLINE_FONT,
        fontSize: HEADLINE_FONT_SIZE,
        bold: true,
        marginTop: HEADLINE_MARGIN_TOP,
        marginBottom: HEADLINE1_MARGIN_BOTTOM,
        lineHeight: 1
    },

    headline: {
        font: HEADLINE_FONT,
        fontSize: HEADLINE_FONT_SIZE,
        bold: false,
        marginTop: HEADLINE_MARGIN_TOP,
        marginBottom: HEADLINE_MARGIN_BOTTOM
    },

    toc1: {
        font: DEFAULT_FONT,
        fontSize: HEADLINE_FONT_SIZE,
        bold: true,
        marginBottom: constants.PARAGRAPH_SPACING,
        lineHeight: 1
    },

    toc1_number: {
        font: DEFAULT_FONT,
        fontSize: HEADLINE_FONT_SIZE,
        bold: true,
        marginBottom: constants.PARAGRAPH_SPACING,
        lineHeight: 1
    },

    toc2: {
        // font: DEFAULT_FONT, // FIXME: Why is this not working?
        // font: 'Times', // FIXME: DEBUG
        color: '#808000', // FIXME: DEBUG
        fontSize: 11,
        marginBottom: constants.PARAGRAPH_SPACING
    },

    toc2_number: {
        // font: DEFAULT_FONT, // FIXME: Why is this not working?
        // font: 'Times', // FIXME: DEBUG
        color: '#808000', // FIXME: DEBUG
        fontSize: 11,
        marginBottom: constants.PARAGRAPH_SPACING
    },

    normal: {
        font: DEFAULT_FONT,
        fontSize: 11,
        lineHeight: 1
    },

    link: {
        italics: true
    }
});
