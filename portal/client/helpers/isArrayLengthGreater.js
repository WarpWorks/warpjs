module.exports = function(array, compareValue) {
    return (compareValue < 0) ? false : (array.length > compareValue);
};
