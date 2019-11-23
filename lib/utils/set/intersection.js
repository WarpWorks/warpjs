const clone = require('./clone');

const intersection = (set1, set2, ...sets) => {
    if (sets && sets.length) {
        return intersection(set1, intersection(set2, ...sets));
    } else if (set2) {
        if (set1.size <= set2.size) {
            return new Set([ ...set1 ].filter((x) => set2.has(x)));
        } else {
            return new Set([ ...set2 ].filter((x) => set1.has(x)));
        }
    } else if (set1) {
        return clone(set1);
    } else {
        return new Set();
    }
};

module.exports = intersection;
