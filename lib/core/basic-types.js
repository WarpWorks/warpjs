const _ = require('lodash');
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
        INVERSED = _.reduce(DATA, (memo, value, key) => {
            return _.extend(memo, { [value.value]: true });
        }, {});
    }
    return INVERSED[type] !== undefined;
}

function typesCheck(type) {
    // debug(`typesCheck(type=${type}`);
    return Object.freeze(_.reduce(
        DATA,
        (memo, value, key) => _.extend(memo, { [`is${key}`]: type === value.value }),
        {}
    ));
}

function defaultValue(type) {
    const foundType = _.find(DATA, (value, key) => value.value === type);
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

module.exports = Object.freeze(_.extend(
    {},
    _.reduce(DATA, (memo, value, key) => _.extend(memo, { [key]: value.value }), {}),
    {
        defaultValue,
        isValid,
        typesCheck
    }
));
