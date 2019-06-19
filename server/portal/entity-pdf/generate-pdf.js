const PdfMake = require('pdfmake');
const pdfFonts = require('pdfmake/build/vfs_fonts');

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

    debug(`documentResource=`, documentResource);

    const generatedPages = pages(documentResource);

    const docDefinition = {
        defaultStyle: generatedPages.defaultStyle,
        styles: generatedPages.styles,
        footer: generatedPages.footer,
        header: generatedPages.header,
        info: generatedPages.meta,

        content: []
            .concat(generatedPages.coverPage)
            .concat(generatedPages.acknowledgements)
            //.concat(generatedPages.tableOfContents)
    };

    const options = {
        bufferPages: false,
        fontLayoutCache: true
    };

    return printer.createPdfKitDocument(docDefinition, options);
};
