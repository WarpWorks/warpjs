// const debug = require('./debug')('generate-toc-numbers');
const setTocNumber = require('./set-toc-number');

const generateTocNumbers = (items, parentVersion) => {
    if (items) {
        items.forEach((item, index) => {
            const newParentVersion = setTocNumber(item, parentVersion, index + 1);
            if (item._embedded) {
                generateTocNumbers(item._embedded.items, newParentVersion);
            }
        });
    }
};

module.exports = (resource) => generateTocNumbers(resource._embedded.items);
