const constants = require('./constants');

module.exports = (docLevel) => docLevel.split(constants.LEVEL_SEPARATOR).length === 1;
