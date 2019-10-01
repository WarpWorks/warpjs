const path = require('path');
const PdfMake = require('pdfmake');
const pdfFonts = require('pdfmake/build/vfs_fonts');

const constants = require('./constants');
// const debug = require('./debug')('generate-pdf');
const makePdfmakeVfsFonts = require('./make-pdfmake-vfs-fonts');
const pages = require('./pages');

const packageFolder = path.dirname(require.resolve('./../../../package.json'));

const baseFontDir = path.join(packageFolder, 'public', 'fonts');

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
    },

    Glyphicons: {
        normal: path.join(baseFontDir, 'glyphicons-halflings-regular.ttf')
    }

};

PdfMake.vfs = pdfFonts.pdfMake.vfs;

module.exports = async (documentResource, req) => {
    makePdfmakeVfsFonts(baseFontDir, PdfMake.vfs);

    const printer = new PdfMake(FONTS);

    const generatedPages = pages(documentResource, req);

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
            const filteredFollowingNodes = followingNodesOnPage.filter((node) => {
                return node.style !== 'pageFooter' && node.style !== 'pageHeader' && !node.canvas && (node.text || node.image || node.headlineLevel);
            });

            if (currentNode.headlineLevel && filteredFollowingNodes.length === 0) {
                return true;
            }
            // Let's add a break if the element is on two pages. But not three,
            // since the content is too long anyways.
            if (currentNode.pageNumbers.length === 2) {
                return true;
            }
        },

        content: []
            .concat(await generatedPages.coverPage(this))
            .concat(await generatedPages.acknowledgements())
            .concat(await generatedPages.tableOfContents())
            .concat(await generatedPages.content(this, req))
    };

    const getFirst = (item) => {
        if (Array.isArray(item)) {
            return getFirst(item[0]);
        }

        return item;
    };

    docDefinition.content.forEach((item, index) => {
        const actualItem = getFirst(item);
        const actualNext = getFirst(docDefinition.content[index + 1]);
        const actualPrev = getFirst(docDefinition.content[index - 1]);

        if (actualItem && actualItem.headlineLevel && actualNext && actualNext.headlineLevel) {
            getFirst(docDefinition.content[index]).style = actualItem.style + 'NospaceBottom';
        }
        if (actualItem && actualItem.headlineLevel && actualPrev && actualPrev.headlineLevel) {
            getFirst(docDefinition.content[index]).style = actualItem.style + 'NospaceTop';
        }
    });

    // debug(`docDefinition=`, JSON.stringify(docDefinition, null, 2));

    const fs = require('fs');
    const date = (new Date()).toISOString().replace(/[^0-9]/g, '');
    fs.writeFileSync(`pdfmake-infinite-loop-${date}.txt`, JSON.stringify(docDefinition, null, 2));

    const options = {
        bufferPages: false,
        fontLayoutCache: true
    };

    try {
        return printer.createPdfKitDocument(docDefinition, options);
    } catch (err) {
        // eslint-disable-next-line no-console
        console.error(`*** ERROR *** createPdfKitDocument():`, err);
        throw new Error(`*** ERROR *** createPdfKitDocument(): ${err}`);
    }
};
