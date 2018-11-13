const heading = require('./heading');
const headingLevel = require('./heading-level');
const language = require('./language');
const visibility = require('./visibility');

module.exports = ($, modal) => {
    heading($, modal);
    headingLevel($, modal);
    language($, modal);
    visibility($, modal);
};
