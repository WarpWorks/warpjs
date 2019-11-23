const union = (set1, set2, ...sets) => set1 ? new Set([ ...set1, ...union(set2, ...sets) ]) : new Set();

module.exports = union;
