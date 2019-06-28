const { PAGE_MARGIN_SIDE } = require('./../constants');
const debug = require('./debug')('footer');

const PAGE_BOTTOM_MARGIN = 30;
const APPROXIMATE_TEXT_HEIGHT = 10;

module.exports = async (documentResource) => (currentPage, pageCount, pageSize) => {

    if (currentPage === 1) {
        return [{
            text: [{
                text: 'Date: ',
                bold: true,
            }, {
                text: 'xx.xx.xxxx\n'
            }, {
                text: 'Version: ',
                bold: true
            }, {
                text: `${documentResource.version}\n`
            }, {
                text: 'Document Number: ',
                bold: true,
            }, {
                text: 'XXXX'
            }],
            style: 'coverPageText',
            color: '#ffffff',
            marginLeft: PAGE_MARGIN_SIDE
        }];
    } else {
        return [{
            text: [{
                text: `<TODO: PublicationDate> | version ${documentResource.version}`
            }, {
                text: `   page ${currentPage}`,
                bold: true
            }],
            alignment: 'right',
            style: 'pageFooter',
            marginRight: PAGE_MARGIN_SIDE,
            marginTop: 40,
        }];
    }
};
