const debug = require('./debug')('generate-toc-numbers-paragraph');
const setTocNumber = require('./set-toc-number');

const generateTocNumbersParagraph = (paragraph, parentVersion, currentLevel, currentNumber = 1) => {
    debug(`paragraph=`, paragraph);

    if (!paragraph.headingLevel) {
        // eslint-disable-next-line no-console
        console.error(`Cannot handle paragraph without headingLevel.`);
        return currentNumber;
    }

    if (paragraph.headingLevel === currentLevel) {
        parentVersion = setTocNumber(paragraph, parentVersion, currentNumber);
        currentNumber = currentNumber + 1;
    } else {
        const currentLevelNumber = parseInt(currentLevel.substr(1), 10);
        if (paragraph.headingLevel === `H${currentLevelNumber + 1}`) {
            debug(`Went down exactly 1 level`);
            // generateTocNumbersParagraph(paragraph, parentVersion, paragraph.headingLevel);
        } else {
            debug(`Invalid level headingLevel=${paragraph.headingLevel} VS currentLevel=${currentLevel}`);
            return currentNumber;
        }
    }

    if (paragraph._embedded && paragraph._embedded.items && paragraph._embedded.items.length) {
        const generateTocNumberDocument = require('./generate-toc-number-document');

        paragraph._embedded.items.forEach((item, index) => generateTocNumberDocument(item, parentVersion, index + 1));
    }

    return currentNumber;
};

module.exports = generateTocNumbersParagraph;
