const fs = require('fs');
const PdfMake = require('pdfmake');
const pdfFonts = require('pdfmake/build/vfs_fonts');

const debug = require('./debug')('generate-pdf');

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

    const docDefinition = {
        defaultStyle: {
            font: 'Helvetica'
        },

        styles: {
            header: {
                fontSize: 22,
                bold: true
            }
        },

        info: {
            title: documentResource.name,
            author: documentResource.author,
            subject: documentResource.description,
            keywords: documentResource.keywords
        },
        content: [
            "TODO"
        ]
    };

    const options = {
        bufferPages: false,
        fontLayoutCache: true
    };

    return printer.createPdfKitDocument(docDefinition, options);
};
