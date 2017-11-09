function findCoords(shape, coords) {
    switch (shape) {
        case 'poly':
            const xCoords = coords.filter((coord, index) => !(index % 2));
            const yCoords = coords.filter((coord, index) => (index % 2));
            return {
                x: Math.floor((Math.min.apply(null, xCoords) + Math.max.apply(null, xCoords)) / 2),
                y: Math.min.apply(null, yCoords)
            };

        case 'circle':
            return {
                x: coords[0],
                y: coords[1] - coords[2]
            };

        case 'rect':
            return {
                x: Math.floor((coords[0] + coords[2]) / 2),
                y: Math.min(coords[1], coords[3])
            };

        default:
            return findCoords('rect', coords);
    }
}

module.exports = findCoords;
