const acknowledgements = require('./acknowledgements');
const content = require('./content');
const coverPage = require('./cover-page');
const defaultStyle = require('./default-style');
const footer = require('./footer');
const header = require('./header');
const meta = require('./meta');
const styles = require('./styles');
const tableOfContents = require('./table-of-contents');

module.exports = (documentResource) => Object.freeze({
    acknowledgements: async () => acknowledgements(documentResource),
    content: async () => content(documentResource),
    coverPage: async () => coverPage(documentResource),
    defaultStyle: async () => defaultStyle(documentResource),
    footer: async () => footer(documentResource),
    header: (currentPage, pageCount, pageSize, docDefinition) => header(documentResource, currentPage, pageCount, pageSize, docDefinition),
    meta: async () => meta(documentResource),
    styles: async () => styles(documentResource),
    tableOfContents: async () => tableOfContents(documentResource)
});
