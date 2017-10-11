const debug = require('debug')('W2:backup:backupSchema');
const fs = require('fs');
const path = require('path');
const Promise = require('bluebird');

// const copyFile = Promise.promisify(fs.copyFile); // FIXME: Use with node8.
const mkdir = Promise.promisify(fs.mkdir);
const readFile = Promise.promisify(fs.readFile);
const writeFile = Promise.promisify(fs.writeFile);

module.exports = (src, outputDir) => {
    const domainFolder = path.join(outputDir, 'domains');
    const dest = path.join(domainFolder, path.basename(src));

    return Promise.resolve()
        .then(() => mkdir(domainFolder))
        .then(() => null, () => null) // Just ignore
        .then(() => debug(`Copying schema ${src}`))
        .then(() => readFile(src))
        .then((content) => writeFile(dest, content))
        .then(() => debug(`Copied '${src}' to '${dest}'.`))
    ;
};
