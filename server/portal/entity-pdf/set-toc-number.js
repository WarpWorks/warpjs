const generateTocNumber = require('./generate-toc-number');

module.exports = (item, parentVersion, currentNumber) => {
    item.tocNumber = generateTocNumber(parentVersion, currentNumber);
    return item.tocNumber;
};
