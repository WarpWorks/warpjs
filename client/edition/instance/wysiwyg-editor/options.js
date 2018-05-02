const constants = require('./constants');
const optionsSetup = require('./options-setup');

module.exports = ($, instanceDoc, canEdit) => {
    console.log("width at runtime?", $(`${constants.MODAL_SELECTOR}`).width());

    return {
        selector: `.${constants.CONTENT_CLASS}`,
        height: $(document).height() * 0.8 - 200,
        width: $(document).width() * 0.75,
        menubar: false,
        elementpath: false,
        anchor_top: false,
        anchor_bottom: false,
        force_br_newlines: false,
        force_p_newlines: false,
        forced_root_block: '',
        paste_as_text: true,
        extended_valid_elements: 'span[!class]',
        plugins: "lists link paste table",
        toolbar: 'bold italic numlist bullist link linkbutton | table',
        setup(editor) {
            optionsSetup($, instanceDoc, editor);
        },
        content_css: '//www.tinymce.com/css/codepen.min.css',
        readonly: !canEdit
    };
};
