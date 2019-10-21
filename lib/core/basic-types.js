const extend = require('lodash/extend');
const find = require('lodash/find');
const reduce = require('lodash/reduce');

// const debug = require('debug')('W2:core:basic-types');

const DATA = Object.freeze({
    Boolean: { value: 'boolean', defaultValue: false },
    Date: { value: 'date', defaultValue: () => (new Date()).toLocaleString() },
    File: { value: 'file', defaultValue: '/change/this/path' },
    Number: { value: 'number', defaultValue: 0 },
    Password: { value: 'password', defaultValue: '************' },
    String: { value: 'string', defaultValue: 'ChangeThisDefaultString' },
    Text: { value: 'text', defaultValue: 'ChangeThisDefaultText' }
});

let INVERSED;
function isValid(type) {
    if (!INVERSED) {
        INVERSED = reduce(DATA, (memo, value, key) => {
            return extend(memo, { [value.value]: true });
        }, {});
    }
    return INVERSED[type] !== undefined;
}

function typesCheck(type) {
    // debug(`typesCheck(type=${type}`);
    return Object.freeze(reduce(
        DATA,
        (memo, value, key) => extend(memo, { [`is${key}`]: type === value.value }),
        {}
    ));
}

function defaultValue(type) {
    const foundType = find(DATA, (value, key) => value.value === type);
    if (foundType) {
        if (typeof foundType.defaultValue === 'function') {
            return foundType.defaultValue();
        } else {
            return foundType.defaultValue;
        }
    } else {
        throw new Error(`Invalid BasicTypes: ${type}`);
    }
}

module.exports = Object.freeze(extend(
    {},
    reduce(DATA, (memo, value, key) => extend(memo, { [key]: value.value }), {}),
    {
        defaultValue,
        isValid,
        typesCheck
    }
));
