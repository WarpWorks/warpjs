const validEnumSelections = require('./../valid-enum-selections');

const MIN_MAX_ENUM_SELECTION = {
    [validEnumSelections.One]: {min: 1, max: 1},
    [validEnumSelections.ZeroOne]: {max: 1},
    [validEnumSelections.ZeroMany]: {},
    [validEnumSelections.OneMany]: {min: 1}
};

module.exports = (validEnumSelection) => MIN_MAX_ENUM_SELECTION[validEnumSelection];
