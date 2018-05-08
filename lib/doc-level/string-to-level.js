/**
 *  Converts a string representation to a level object `{ key, value }`.
 */

const constants = require('./constants');

module.exports = (string) => {
    const tokens = string.split(constants.KEY_VALUE_SEP);
    const key = tokens.shift();
    const value = tokens.join(constants.KEY_VALUE_SEP);
    return { key, value };
};
