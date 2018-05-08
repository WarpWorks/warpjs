const constants = require('./constants');

module.exports = ($, instanceDoc) => {
    instanceDoc.on('click', `.${constants.SELECTION_MODAL_CLASS} .warpjs-selected-entities .warpjs-selected-entity`, function() {
        $(this).remove();
    });
};
