const path = require('path');
const PdfMake = require('pdfmake');
const pdfFonts = require('pdfmake/build/vfs_fonts');

const constants = require('./constants');
const debug = require('./debug')('generate-pdf');
const makePdfmakeVfsFonts = require('./make-pdfmake-vfs-fonts');
const pages = require('./pages');

const baseFontDir = path.join('public', 'fonts');

const FONTS = {
    // https://github.com/vernnobile/MuliFont/tree/master/version-2.0
    Muli: {
        normal: path.join(baseFontDir, 'Muli.ttf'),
        bold: path.join(baseFontDir, 'Muli-Bold.ttf'),
        italics: path.join(baseFontDir, 'Muli-Italic.ttf'),
        bolditalics: path.join(baseFontDir, 'Muli-BoldItalic.ttf')
    },

    // https://github.com/vernnobile/OswaldFont/tree/master/3.0
    Oswald: {
        normal: path.join(baseFontDir, 'Oswald-Regular.ttf'),
        bold: path.join(baseFontDir, 'Oswald-Bold.ttf'),
        italics: path.join(baseFontDir, 'Oswald-Regular.ttf'),
        bolditalics: path.join(baseFontDir, 'Oswald-Bold.ttf')
    },

    // Standard 14 fonts
    Courier: {
        normal: 'Courier',
        bold: 'Courier-Bold',
        italics: 'Courier-Oblique',
        bolditalics: 'Courier-BoldOblique'
    },
    Helvetica: {
        normal: 'Helvetica',
        bold: 'Helvetica-Bold',
        italics: 'Helvetica-Oblique',
        bolditalics: 'Helvetica-BoldOblique'
    },
    Times: {
        normal: 'Times-Roman',
        bold: 'Times-Bold',
        italics: 'Times-Italic',
        bolditalics: 'Times-BoldItalic'
    },
    Symbol: {
        normal: 'Symbol'
    },
    ZapfDingbats: {
        normal: 'ZapfDingbats'
    },

    // https://github.com/bpampuch/pdfmake/tree/master/examples/fonts
    Roboto: {
        normal: path.join(baseFontDir, 'Roboto-Regular.ttf'),
        bold: path.join(baseFontDir, 'Roboto-Medium.ttf'),
        italics: path.join(baseFontDir, 'Roboto-Italic.ttf'),
        bolditalics: path.join(baseFontDir, 'Roboto-MediumItalic.ttf')
    }
};

PdfMake.vfs = pdfFonts.pdfMake.vfs;

module.exports = async (documentResource) => {
    makePdfmakeVfsFonts(baseFontDir, PdfMake.vfs);

    const printer = new PdfMake(FONTS);

    const generatedPages = pages(documentResource);

    // TODO: How to define which of `LETTER` or `A4` to use?
    const pageSize = constants.DEFAULT_PAGE_SIZE;

    const docDefinition = {
        pageSize,
        pageOrientation: 'portrait',
        pageMargins: [ constants.PAGE_MARGIN_SIDE, constants.PAGE_MARGIN_TOP + constants.PAGE_HEADER_SIZE, constants.PAGE_MARGIN_SIDE, constants.PAGE_MARGIN_BOTTOM ],

        defaultStyle: await generatedPages.defaultStyle(),
        styles: await generatedPages.styles(),
        footer: await generatedPages.footer(),
        header: (currentPage, pageCount, pageSize) => generatedPages.header(currentPage, pageCount, pageSize, docDefinition),
        info: await generatedPages.meta(),

        pageBreakBefore: (currentNode, followingNodesOnPage, nodesOnNextPage, previousNodesOnPage) => {
            // This call is not recursive, as if we change a node, previous
            // nodes are not rechecked. So we have to put all the logic on this
            // node.

            // Prevent the last node on the page to be a headline.
            // if (currentNode.headlineLevel) {
            //     debug(`pageBreakBefore()... ${currentNode.headlineLevel}: ${currentNode.text}`);
            //     debug(`pageBreakBefore(): followingNodesOnPage: length=${followingNodesOnPage.length}`, followingNodesOnPage);
            // }

            // Let's add a break if the element is on two pages. But not three,
            // since the content is too long anyways.
            if (currentNode.pageNumbers.length === 2) {
                return true;
            }

            // Make sure headers are not at the end of the page.
            // if (currentNode.headlineLevel && followingNodesOnPage.length === 0) {
            //     debug(`pageBreakBefore(): headline as last element.`);
            //     return true;
            // }

            // debug(`pageBreakBefore(): currentNode=`, currentNode);
        },

        content: []
            .concat(await generatedPages.coverPage(this))
            .concat(await generatedPages.acknowledgements())
            .concat(await generatedPages.tableOfContents())
            .concat(await generatedPages.content(this))
    };

    const options = {
        bufferPages: false,
        fontLayoutCache: true
    };

    try {
        return printer.createPdfKitDocument(docDefinition, options);
    } catch (err) {
        console.error(`*** ERROR *** createPdfKitDocument():`, err);
    }
};
