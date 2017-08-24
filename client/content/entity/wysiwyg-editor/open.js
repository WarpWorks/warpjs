const Promise = require('bluebird');
const tinymce = require('tinymce');
require('tinymce/themes/modern/theme');

const cache = require('./cache');
const constants = require('./constants');
const options = require('./options');
const template = require('./template.hbs');

module.exports = ($, instanceDoc) => {
    instanceDoc.on('click', '[data-warpjs-action="open-wysiwyg"]', function() {
        const input = $(this).parent().children('input');

        cache.input = input;

        return Promise.resolve()
            .then(() => {
                if (!$(`.${constants.MODAL_CLASS}`).length) {
                    const content = template(constants);
                    instanceDoc.append(content);
                }
            })
            .then(() => {
                if (!tinymce.editors.length) {
                    return tinymce.init(options($, instanceDoc));
                }
            })
            .then(() => tinymce.activeEditor.setContent(input.val()))
            .then(() => $(`.${constants.MODAL_CLASS}`).modal('show'))
            .catch((err) => {
                console.log("error tinymce.init()...", err);
            });
    });
};
