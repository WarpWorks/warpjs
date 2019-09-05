const { PAGE_MARGIN_SIDE } = require('./../constants');
// const debug = require('./debug')('footer');

// const PAGE_BOTTOM_MARGIN = 30;
// const APPROXIMATE_TEXT_HEIGHT = 10;

module.exports = async (documentResource) => (currentPage, pageCount, pageSize) => {
    if (currentPage === 1) {
        const releaseDate = documentResource.releaseDate || '';
        return [{
            text: [{
                text: 'Date: ',
                bold: true
            }, {
                text: `${releaseDate}\n`
            }, {
                text: 'Version: ',
                bold: true
            }, {
                text: `${documentResource.version}\n`
            }],
            style: 'coverPageText',
            color: '#ffffff',
            marginLeft: PAGE_MARGIN_SIDE
        }];
    } else {
        const releaseDateString = documentResource.releaseDate
            ? `${documentResource.releaseDate} | `
            : '';

        return [{
            text: [{
                text: `${releaseDateString}version ${documentResource.version}`
            }, {
                text: `   page ${currentPage}`,
                bold: true
            }],
            alignment: 'right',
            style: 'pageFooter',
            marginRight: PAGE_MARGIN_SIDE,
            marginTop: 40
        }];
    }
};
