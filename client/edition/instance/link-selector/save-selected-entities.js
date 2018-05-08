const tinymce = require('tinymce');

const constants = require('./constants');

module.exports = ($, instanceDoc) => {
    instanceDoc.on('click', `.${constants.SELECTION_MODAL_CLASS} .warpjs-selection-save`, function() {
        const links = $(`.${constants.SELECTION_MODAL_CLASS} .warpjs-selected-entities .warpjs-selected-entity`)
            .map((idx, entity) => $(entity).data('warpjsValue'))
            .get()
            .join(" ");

        if (links) {
            tinymce.activeEditor.execCommand('mceInsertContent', false, links);
        }

        $(`.${constants.SELECTION_MODAL_CLASS}`).modal('hide');
    });
};
