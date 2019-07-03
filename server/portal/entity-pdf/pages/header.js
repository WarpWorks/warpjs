const constants = require('./../constants');
// const debug = require('./debug')('header');

module.exports = (documentResource, currentPage, pageCount, pageSize, docDefinition) => {
    if (currentPage === 1) {
        return null;
    }

    const headlines = docDefinition.content.filter((item) => {
        // debug(`filter for headlines(): item=`, item);
        if (item.stack) {
            return item.stack.find((stackItem) => stackItem.headlineLevel === 1);
        } else {
            return item.headlineLevel === 1;
        }
    });
    // debug(`headlines=`, headlines);

    const currentSection = headlines.reduce(
        (currentHeadline, headline, index) => {
            // debug(`looking headline=`, headline);

            const positions = headline.toc ? headline.toc.title.positions : headline.positions;
            if (positions && positions.length) {
                const positionInfo = positions[0];
                if (positionInfo.pageNumber > currentPage) {
                    return currentHeadline;
                } else if (headline.stack) {
                    const headlineItem = headline.stack.find((stackItem) => stackItem.headlineLevel === 1);
                    return headlineItem.text;
                } else if (headline.toc) {
                    return headline.toc.title.text;
                } else {
                    return headline.text;
                }
            }
            return currentHeadline;
        },
        ''
    );

    return [
        {
            columns: [
                {
                    stack: [
                        {
                            text: documentResource.name,
                            style: 'pageHeader'
                        },
                        {
                            text: currentSection,
                            style: 'pageHeader'
                        }
                    ],
                    alignment: 'left',
                    width: '100%',
                    margin: [ constants.PAGE_MARGIN_SIDE, constants.PAGE_MARGIN_TOP, 0, 5 ]
                }
            ]
        },
        {
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
        }
    ];
};
