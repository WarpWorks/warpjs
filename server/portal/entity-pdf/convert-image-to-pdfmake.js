/**
 *  This module now handles images that are on local disk.
 *
 *  pdfmake cannot handle interlace PNG. Need to convert them.
 */

const fs = require('fs');
const imageToBase64 = require('image-to-base64');
const mimeTypes = require('mime-types');
const path = require('path');
const { PNG } = require('pngjs');

const serverUtils = require('./../../utils');

const config = serverUtils.getConfig();

module.exports = async (imageUrl) => {
    try {
        let imageFilePath = path.join(config.folders.w2projects, imageUrl);
        const nonInterlacePngFilePath = imageFilePath.replace('.png', '-non-interlace.png');

        const mime = mimeTypes.lookup(imageFilePath);

        if (fs.existsSync(nonInterlacePngFilePath)) {
            imageFilePath = nonInterlacePngFilePath;
        } else {
            switch (mime) {
                case 'image/png': {
                    let buffer = fs.readFileSync(imageFilePath);
                    const png = PNG.sync.read(buffer);
                    if (png.interlace) {
                        buffer = PNG.sync.write(png, { interlace: false });
                        fs.writeFileSync(nonInterlacePngFilePath, buffer);
                        imageFilePath = nonInterlacePngFilePath;
                    }
                    break;
                }
            }
        }

        const base64 = await imageToBase64(imageFilePath);
        return `data:${mime};base64,${base64}`;
    } catch (err) {
        // eslint-disable-next-line no-console
        console.error(`Error with imageToBase64():`, err);
    }
};
