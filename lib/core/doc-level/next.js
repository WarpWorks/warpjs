const constants = require('./constants');

module.exports = (docLevel) => docLevel.split(constants.LEVEL_SEPARATOR).slice(1).join(constants.LEVEL_SEPARATOR);
