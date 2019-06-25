const clone = require('lodash/clone');

// const debug = require('./debug')('oxford-comma');
module.exports = (items) => {
    if (!items.length) {
        return '';
    } else if (items.length === 1) {
        return items[0];
    } else if (items.length === 2) {
        return items.join(' and ');
    } else {
        const clones = clone(items);
        clones[clones.length - 1] = ` and ${clones[clones.length - 1]}`;
        return clones.join(', ');
    }
};
