const deleteClicked = require('./delete-clicked');
const heading = require('./heading');
const headingLevel = require('./heading-level');
const historyClicked = require('./history-clicked');
const language = require('./language');
const visibility = require('./visibility');

module.exports = ($, modal) => {
    deleteClicked($, modal);
    heading($, modal);
    headingLevel($, modal);
    historyClicked($, modal);
    language($, modal);
    visibility($, modal);
};
