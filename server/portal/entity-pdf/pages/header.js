const { LINE_COLOR } = require('./../constants');
const debug = require('./debug')('header');

module.exports = (documentResource, currentPage, pageCount, pageSize, docDefinition) => {
    if (currentPage === 1) {
        return null;
    }

    const headlines = docDefinition.content.filter((item) => item.headlineLevel === 1);

    const currentSection = headlines.reduce(
        (currentHeadline, headline, index) => {
            debug(`headline=`, headline);

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
            margin: 20
        }, {
            text: currentSection,
            alignment: 'right',
            width: '50%',
            margin: 20
        }]
    }, {
        canvas: [{
            type: 'line',
            x1: 20, y1: 0,
            x2: pageSize.width - 20, y2:0,
            lineWidth: 2,
            lineColor: LINE_COLOR,
        }]
    }];
};
