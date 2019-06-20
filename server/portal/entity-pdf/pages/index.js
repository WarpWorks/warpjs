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
    acknowledgements: acknowledgements(documentResource),
    content: content(documentResource),
    coverPage: coverPage(documentResource),
    defaultStyle: defaultStyle(documentResource),
    footer: footer(documentResource),
    header: (documentResource, currentPage, pageCount, pageSize, docDefinition) => header(documentResource, currentPage, pageCount, pageSize, docDefinition),
    meta: meta(documentResource),
    styles: styles(documentResource),
    tableOfContents: tableOfContents(documentResource)
});
