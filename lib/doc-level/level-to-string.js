/**
 *  Converts a docLevel object `{ key, value }` to a string representation.
 */

const constants = require('./constants');

module.exports = (level) => [ level.key, level.value ].join(constants.KEY_VALUE_SEP);
