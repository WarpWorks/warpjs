const byNumberThanString = require('./by-number-then-string');

module.exports = (set) => set ? [ ...set ].sort(byNumberThanString) : [];
