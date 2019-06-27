const fs = require('fs');
const path = require('path');

// const debug = require('./debug')('make-pdfmake-vfs-fonts');

let initialized;

const walk = (folder) => {
    const folderContent = fs.readdirSync(folder);
    return folderContent.reduce(
        (memo, item) => {
            const itemPath = path.join(folder, item);
            const stats = fs.statSync(itemPath);
            if (stats.isDirectory()) {
                return memo.concat(walk(itemPath));
            } else if (stats.isFile() && (path.extname(itemPath) === '.ttf')) {
                return memo.concat(itemPath);
            } else {
                return memo;
            }
        },
        []
    );
};

module.exports = (baseFontDir, vfs) => {
    if (!initialized) {
        const fontFiles = walk(baseFontDir);

        fontFiles.forEach((fontFile) => {
            if (!vfs[fontFile]) {
                const binaryContent = fs.readFileSync(fontFile);
                vfs[fontFile] = binaryContent.toString('base64');
            }
        });
    }
};
