const _ = require('lodash');
// const debug = require('debug')('W2:portal:resources/sort-into-columns');

module.exports = (items, nbOfColumns) => {
    const clone = _.clone(items);
    const sorted = [];

    for (let columnIndex = nbOfColumns; columnIndex > 0; columnIndex--) {
        const nbElements = Math.ceil(clone.length / columnIndex);
        sorted.push(clone.splice(0, nbElements));
    }

    // debug(`sorted=`, sorted);

    const finalResults = [];

    const nbOfRows = Math.ceil(items.length / nbOfColumns);

    for (let rowIndex = 0; rowIndex < nbOfRows; rowIndex++) {
        for (let columnIndex = 0; columnIndex < sorted.length; columnIndex++) {
            // debug(`columnIndex=${columnIndex}; rowIndex=${rowIndex}`);
            if (rowIndex >= sorted[columnIndex].length) {
                finalResults.push(null);
            } else {
                finalResults.push(sorted[columnIndex][rowIndex]);
            }
        }
    }

    return finalResults;
};
