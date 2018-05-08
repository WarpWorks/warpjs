const tinymce = require('tinymce');

const cache = require('./cache');
const constants = require('./constants');

module.exports = ($, instanceDoc) => {
    instanceDoc.on('click', `${constants.MODAL_SELECTOR} [data-warpjs-action="save"]`, function() {
        const content = tinymce.activeEditor.getContent();

        if (content !== cache.input.val()) {
            cache.input.val(content);
            cache.input.trigger('change');
        }

        $(constants.MODAL_SELECTOR).modal('hide');
    });
};
