const constants = require('./constants');
const debug = require('./debug')('generate-toc-numbers-for-document-items');
// const generateTocNumbersParagraph = require('./generate-toc-numbers-paragraph');
const setTocNumber = require('./set-toc-number');

module.exports = (items, parentVersion, currentLevel = 'H1') => {
    // These are the one to be numbered at this level.
    const paragraphsAndCommunity = items.filter((item) => (item.type === constants.TYPES.PARAGRAPH && item.headingLevel === currentLevel) || (item.type === constants.TYPES.COMMUNITY));
    debug(`paragraphsAndCommunity=`, paragraphsAndCommunity);

    paragraphsAndCommunity.forEach((item, index) => {
        setTocNumber(item, parentVersion, index + 1);
    });

    // Now find the elements between each element of this level.

    // let currentNumber = 1;
    // for (let index = 0; index < items.length; ) {
    //     const item = items[index];

    //     if (item.type === constants.TYPES.PARAGRAPH) {
    //         currentNumber = generateTocNumbersParagraph(item, parentVersion, currentLevel, currentNumber);
    //     } else if (item.type === constants.TYPES.COMMUNITY) {
    //         setTocNumber(item, parentVersion, currentNumber);
    //         currentNumber += 1;
    //     } else {
    //         // eslint-disable-next-line no-console
    //         console.error(`Unknown type='${item.type}'`);
    //     }
    // }
};
