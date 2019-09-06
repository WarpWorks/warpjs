// const debug = require('./debug')('generate-toc-numbers');
const generateTocNumber = require('./generate-toc-number');
const setTocNumber = require('./set-toc-number');

const generateTocNumbers = (items, parentVersion, offset = 0, level = 1) => {
    if (items) {
        let newParentVersion = generateTocNumber(parentVersion, offset);
        let childOffset = 0;
        items.reduce(
            (currentCounter, item, index) => {
                if (item.heading || item.name) {
                    newParentVersion = setTocNumber(item, parentVersion, currentCounter + offset);
                    childOffset = 0;
                    if (item._embedded && item._embedded.items && item._embedded.items.length) {
                        generateTocNumbers(item._embedded.items, newParentVersion, childOffset, level + 1);
                        childOffset += item._embedded.items.length;
                    }
                    return currentCounter + 1;
                } else if (item._embedded && item._embedded.items && item._embedded.items.length) {
                    generateTocNumbers(item._embedded.items, newParentVersion, childOffset, level + 1);
                    childOffset += item._embedded.items.length;
                }
                return currentCounter;
            },
            1
        );
    }
};

module.exports = (resource) => generateTocNumbers(resource._embedded.items);
