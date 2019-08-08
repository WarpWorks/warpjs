// const debug = require('./debug')('content');
const itemElement = require('./item-element');

module.exports = async (documentResource, docDefinition, req) => {
    if (!documentResource || !documentResource._embedded || !documentResource._embedded.items || !documentResource._embedded.items.length) {
        throw new Error('No content for PDF.');
    }

    return documentResource._embedded.items.reduce(
        (memo, item) => memo.concat(itemElement(item, docDefinition, 1, req)),
        []
    );
};
