/**
 *  Get the top-center coordinates.
 */

const topCenterOfCoords = require('./top-center-of-coords');

module.exports = ($, imageArea) => {
    const shape = ($(imageArea).attr('shape') || 'rect').toLowerCase();
    const coords = $(imageArea).attr('coords');

    if (coords) {
        return topCenterOfCoords(shape, coords.split(',').map((coord) => parseInt(coord, 10)));
    } else {
        return null;
    }
};
