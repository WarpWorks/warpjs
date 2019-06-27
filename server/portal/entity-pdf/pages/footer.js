const { PAGE_MARGIN_SIDE } = require('./../constants');
// const debug = require('./debug')('footer');

module.exports = async (documentResource) => (currentPage, pageCount, pageSize) => {
    if (currentPage === 1) {
        return null;
    }

    return [{
        text: [{
            text: `<TODO: PublicationDate> | version ${documentResource.version}`
        }, {
            text: `   page ${currentPage}`,
            bold: true
        }],
        alignment: 'right',
        style: 'pageFooter',
        marginRight: PAGE_MARGIN_SIDE
    }];
};
