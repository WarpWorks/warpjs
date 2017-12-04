const constants = require('./constants');
const updateSelectionEntities = require('./update-selection-entities');

module.exports = ($, instanceDoc) => instanceDoc.on('change', `${constants.DIALOG_SELECTOR} .warpjs-selection-types`, function(e) {
    e.stopPropagation();
    e.preventDefault();

    updateSelectionEntities($, instanceDoc);
});
