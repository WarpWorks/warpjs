const union = (set1, set2, ...sets) => {
    if (set1) {
        return new Set([ ...set1, ...union(set2, ...sets) ]);
    } else {
        return new Set();
    }
};

module.exports = union;
