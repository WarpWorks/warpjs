const constants = require('./constants');
const optionsSetup = require('./options-setup');

module.exports = ($, instanceDoc) => {
    return {
        selector: `.${constants.CONTENT_CLASS}`,
        height: 200,
        menubar: false,
        elementpath: false,
        anchor_top: false,
        anchor_bottom: false,
        force_br_newlines: false,
        force_p_newlines: false,
        forced_root_block: '',
        paste_as_text: true,
        extended_valid_elements: 'span[!class]',
        plugins: "lists link paste",
        toolbar: 'bold italic numlist bullist link linkbutton',
        setup(editor) {
            optionsSetup($, instanceDoc, editor);
        },
        content_css: '//www.tinymce.com/css/codepen.min.css'
    };
};
