const { LINE_COLOR } = require('./../constants');
const debug = require('./debug')('footer');

module.exports = (documentResource) => (currentPage, pageCount, pageSize) => {
    if (currentPage === 1) {
        return null;
    }

    return [{
        canvas: [{
            type: 'line',
            x1: 20, y1: 0,
            x2: pageSize.width - 20, y2: 0,
            lineWidth: 2,
            lineColor: LINE_COLOR
        }]
    }, {
        columns: [{
            text: "<TODO: PublicationDate>",
            alignment: 'left',
            width: '40%',
            margin: [ 20, 5, 0, 0 ]
        }, {
            text: `- ${currentPage} -`,
            alignment: 'center',
            width: '20%',
            margin: [ 0, 5, 0, 0 ]
        }, {
            text: `Version ${documentResource.version}`,
            alignment: 'right',
            width: '40%',
            margin: [ 0, 5, 20, 0 ]
        }],
    }];
};
