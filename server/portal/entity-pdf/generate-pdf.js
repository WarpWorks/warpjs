const PdfMake = require('pdfmake');
const pdfFonts = require('pdfmake/build/vfs_fonts');

const { PAGE_MARGIN, PAGE_HEADER_SIZE, PAGE_FOOTER_SIZE } = require('./constants');
const debug = require('./debug')('generate-pdf');
const pages = require('./pages');

PdfMake.vfs = pdfFonts.pdfMake.vfs;

const FONTS = {
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
    }
};

module.exports = async (documentResource) => {
    const printer = new PdfMake(FONTS);

    const generatedPages = pages(documentResource);

    const docDefinition = {
        pageMargins: [ PAGE_MARGIN, PAGE_MARGIN + PAGE_HEADER_SIZE, PAGE_MARGIN, PAGE_MARGIN + PAGE_FOOTER_SIZE ],

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
            //     debug(`pageBreakBefore(): followingNodesOnPage=`, followingNodesOnPage);
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
            .concat(await generatedPages.coverPage())
            .concat(await generatedPages.acknowledgements())
            .concat(await generatedPages.tableOfContents())
            .concat(await generatedPages.content())
    };

    const options = {
        bufferPages: false,
        fontLayoutCache: true
    };

    return printer.createPdfKitDocument(docDefinition, options);
};
