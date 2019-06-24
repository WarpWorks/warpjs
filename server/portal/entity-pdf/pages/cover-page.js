const imageToBase64 = require('image-to-base64');
const mimeTypes = require('mime-types');
const path = require('path');

const debug = require('./debug')('cover-page');
const serverUtils = require('./../../../utils');

const config = serverUtils.getConfig();

let coverImage;

module.exports = async (documentResource) => {
    if (!coverImage) {
        try {
            const imageFilePath = path.join(config.folders.w2projects, config.pdfCoverImage);
            const base64 = await imageToBase64(imageFilePath);
            const mime = mimeTypes.lookup(imageFilePath);
        } catch (err) {
            console.error(`Error with imageToBase64():`, err);
        }
    };

    return [ {
        text: "Cover page image",
        alignment: 'center'
    }, {
        text: documentResource.name,
        fontSize: 24,
        bold: true,
        alignment: 'center'
    }, {
        text: "TODO: Document ID",
        alignment: 'center'
    }];
};
