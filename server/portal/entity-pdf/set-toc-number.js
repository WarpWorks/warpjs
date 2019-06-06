module.exports = (item, parentVersion, currentNumber) => {
    item.tocNumber = parentVersion ? `${parentVersion}.${currentNumber}` : currentNumber;
    return item.tocNumber;
};
