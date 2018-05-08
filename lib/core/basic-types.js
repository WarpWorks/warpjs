const _ = require('lodash');

const BASIC_TYPES = {
    String: "string",
    Text: "text",
    Password: "password",
    Number: "number",
    Boolean: "boolean",
    Date: "date"
};

const INVERSED = _.reduce(BASIC_TYPES, (memo, value, key) => {
    return _.extend(memo, {[value]: true});
}, {});

function isValid(type) {
    return INVERSED[type] !== undefined;
}

function typesCheck(type) {
    return {
        isString: type === BASIC_TYPES.String,
        isText: type === BASIC_TYPES.Text,
        isPassword: type === BASIC_TYPES.Password,
        isNumber: type === BASIC_TYPES.Number,
        isBoolean: type === BASIC_TYPES.Boolean,
        isDate: type === BASIC_TYPES.Date
    };
}

module.exports = _.extend({}, BASIC_TYPES, {
    isValid,
    typesCheck
});
