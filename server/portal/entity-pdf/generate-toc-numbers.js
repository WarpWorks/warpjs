// const debug = require('./debug')('generate-toc-numbers');
const generateTocNumbersForDocumentItems = require('./generate-toc-numbers-for-document-items');

module.exports = (resource) => {
    generateTocNumbersForDocumentItems(resource._embedded.items);
};
