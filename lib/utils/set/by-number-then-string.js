const isNumber = (a) => typeof a === 'number';

module.exports = (a, b) => {
    if (isNumber(a)) {
        if (isNumber(b)) {
            return a - b;
        } else {
            return -1;
        }
    } else if (isNumber(b)) {
        return 1;
    } else {
        return a.localeCompare(b);
    }
};
