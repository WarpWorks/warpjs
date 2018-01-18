const tinymce = require('tinymce');

const cache = require('./cache');
const constants = require('./constants');

module.exports = ($, instanceDoc) => {
    instanceDoc.on('click', `.${constants.MODAL_CLASS} [data-warpjs-action="save"]`, function() {
        const content = tinymce.activeEditor.getContent();

        if (content !== cache.input.val()) {
            cache.input.val(content);
            cache.input.trigger('change');
        }

        $(`.${constants.MODAL_CLASS}`).modal('hide');
    });
};
