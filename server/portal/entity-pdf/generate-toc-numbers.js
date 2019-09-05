const debug = require('./debug')('generate-toc-numbers');
const generateTocNumber = require('./generate-toc-number');
const setTocNumber = require('./set-toc-number');

const generateTocNumbers = (items, parentVersion, offset = 0) => {
    if (items) {
        let lastParentVersion = parentVersion;
        items.reduce(
            (currentCounter, item) => {
                debug(`${parentVersion}: ${currentCounter}: item=`, item.heading);
                if (item.heading) {
                    const newParentVersion = setTocNumber(item, parentVersion, currentCounter);
                    debug(`    ${parentVersion}: ${currentCounter}: newParentVersion1=`, newParentVersion);
                    if (item._embedded && item._embedded.items && item._embedded.items.length) {
                        generateTocNumbers(item._embedded.items, newParentVersion, offset);
                        offset += item._embedded.items.length;
                    }
                    return currentCounter + 1;
                } else if (item._embedded && item._embedded.items && item._embedded.items.length) {
                    generateTocNumbers(item._embedded.items, parentVersion, offset);
                    offset += item._embedded.items.length;
                } else {
                    debug(`    ${parentVersion}: ${currentCounter}: No tocNumber`);
                }
                return currentCounter;
            },
            1
        )
    }
};

module.exports = (resource) => generateTocNumbers(resource._embedded.items);
