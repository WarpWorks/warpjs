const constants = require('./constants');

module.exports = (docLevel) => {
    const firstLevel = docLevel.split(constants.LEVEL_SEPARATOR, 1).pop();
    if (firstLevel) {
        const levelChunks = firstLevel.split(constants.DATA_SEPARATOR);
        if (levelChunks.length) {
            return {
                type: levelChunks[0],
                value: levelChunks.slice(1).join(constants.DATA_SEPARATOR)
            };
        } else {
            return null;
        }
    } else {
        return null;
    }
};
