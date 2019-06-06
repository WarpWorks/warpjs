const debug = require('./debug')('generate-toc-number-document');
const generateTocNumbersForDocumentItems = require('./generate-toc-numbers-for-document-items');
const setTocNumber = require('./set-toc-number');

module.exports = (documentItem, parentVersion, currentNumber) => {
    parentVersion = setTocNumber(documentItem, parentVersion, currentNumber);
    debug(`parentVersion=${parentVersion}; currentNumber=${currentNumber}; documentItem=`, documentItem);
    if (documentItem._embedded && documentItem._embedded.items) {
        generateTocNumbersForDocumentItems(documentItem._embedded.items, parentVersion);
    }
};
