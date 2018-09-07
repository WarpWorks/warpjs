const deleteClicked = require('./delete-clicked');
const headerLevel = require('./header-level');
const historyClicked = require('./history-clicked');
const language = require('./language');
const movePosition = require('./move-position');
const visibility = require('./visibility');

module.exports = ($, modal) => {
    deleteClicked($, modal);
    headerLevel($, modal);
    historyClicked($, modal);
    language($, modal);
    movePosition($, modal);
    visibility($, modal);
};
