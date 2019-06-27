const constants = require('./../constants');
// const debug = require('./debug')('header');

module.exports = (documentResource, currentPage, pageCount, pageSize, docDefinition) => {
    if (currentPage === 1) {
        return null;
    }

    const headlines = docDefinition.content.filter((item) => item.headlineLevel === 1);

    const currentSection = headlines.reduce(
        (currentHeadline, headline, index) => {
            const positions = headline.toc ? headline.toc.title.positions : headline.positions;
            if (positions && positions.length) {
                const positionInfo = positions[0];
                if (positionInfo.pageNumber > currentPage) {
                    return currentHeadline;
                } else {
                    return headline.toc ? headline.toc.title.text : headline.text;
                }
            }
            return currentHeadline;
        },
        ''
    );

    return [{
        columns: [{
            text: documentResource.name,
            alignment: 'left',
            width: '50%',
            margin: [ constants.PAGE_MARGIN_SIDE, constants.PAGE_MARGIN_TOP, 0, 0 ]
        }, {
            text: currentSection,
            alignment: 'right',
            width: '50%',
            margin: [ 0, constants.PAGE_MARGIN_SIDE, constants.PAGE_MARGIN_TOP, 0 ]
        }],
        margin: 0
    }, {
        canvas: [{
            type: 'line',
            x1: constants.PAGE_MARGIN_SIDE,
            y1: 0,
            x2: pageSize.width - constants.PAGE_MARGIN_SIDE,
            y2: 0,
            lineWidth: constants.PAGE_HEADER_LINE_WIDTH,
            lineColor: constants.PAGE_HEADER_LINE_COLOR
        }],
        margin: 0
    }];
};
