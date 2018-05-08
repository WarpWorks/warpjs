const open = require('./open');
const save = require('./save');

module.exports = ($, instanceDoc) => {
    // Bug in tinymce
    $(document).on('focusin', function(e) {
        if ($(e.target).closest('.mce-window').length) {
            e.stopImmediatePropagation();
        }
    });

    open($, instanceDoc);
    save($, instanceDoc);
};
