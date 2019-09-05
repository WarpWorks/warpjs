module.exports = (parentVersion, currentNumber) => parentVersion ? `${parentVersion}.${currentNumber}` : `${currentNumber}`;
