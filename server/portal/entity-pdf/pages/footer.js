const { LINE_COLOR, PAGE_MARGIN } = require('./../constants');
// const debug = require('./debug')('footer');

module.exports = async (documentResource) => (currentPage, pageCount, pageSize) => {
    if (currentPage === 1) {
        return null;
    }

    return [{
        canvas: [{
            type: 'line',
            x1: PAGE_MARGIN,
            y1: 0,
            x2: pageSize.width - PAGE_MARGIN,
            y2: 0,
            lineWidth: 2,
            lineColor: LINE_COLOR
        }],
        margin: 0
    }, {
        columns: [{
            text: "<TODO: PublicationDate>",
            alignment: 'left',
            width: '40%',
            margin: [ PAGE_MARGIN, 5, 0, 0 ]
        }, {
            text: `- ${currentPage} -`,
            alignment: 'center',
            width: '20%',
            margin: [ 0, 5, 0, 0 ]
        }, {
            text: `Version ${documentResource.version}`,
            alignment: 'right',
            width: '40%',
            margin: [ 0, 5, PAGE_MARGIN, 0 ]
        }],
        margin: 0
    }];
};
