module.exports = Object.freeze({
    DEFAULT_PAGE_VIEW_NAMES: Object.freeze([ 'PdfView', 'DefaultPortalView' ]),
    TYPES: Object.freeze({
        COMMUNITY: 'RESERVED-TYPE-COMMUNITY',
        PARAGRAPH: 'Paragraph'
    }),

    DEFAULT_PAGE_SIZE: 'LETTER',
    // DEFAULT_PAGE_SIZE: 'A4',
    DEFAULT_PAGE_ORIENTATION: 'portrait',

    MAX_TOC_DEEP_LEVEL: 10,
    TOC_NAME: 'mainToc',
    IMAGE_TOC_NAME: 'imagesToc',
    FONT_SIZE: {
        1: 24,
        2: 21,
        3: 18,
        4: 16,
        5: 14,
        6: 12,
        7: 11
    },
    TOC_FONT_SIZE: {
        1: 12,
        2: 11
    },
    DEFAULT_TOC_FONT_SIZE: 10,

    LINE_COLOR: '#fc0d1b',

    PAGE_MARGIN_SIDE: 70,
    PAGE_MARGIN_TOP: 40,
    PAGE_MARGIN_BOTTOM: 80,

    PAGE_HEADER_LINE_WIDTH: 1,
    PAGE_HEADER_LINE_COLOR: '#f0f0f0',

    PAGE_HEADER_SIZE: 50,
    PAGE_FOOTER_SIZE: 20,

    COVER_PAGE_LOGO_MAX_HEIGHT: 150,
    COVER_PAGE_IMAGE_OFFSET: 30,
    COVER_PAGE_MARGIN_BELOW_IMAGE: 15,
    COVER_PAGE_BOTTOM_TEXT_HEIGHT: 60
});
