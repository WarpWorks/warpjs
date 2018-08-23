const warpjsUtils = require('@warp-works/warpjs-utils');

const textModal = require('./text-modal');

const classes = Object.freeze({
    GLOBAL: '.warpjs-inline-edit-global',
    IN_EDIT: 'warpjs-inline-edit-global-in-edit'
});

module.exports = ($) => {
    $(document).on('click', classes.GLOBAL, function() {
        if ($('body').hasClass(classes.IN_EDIT)) {
            $('body').removeClass(classes.IN_EDIT);
        } else {
            $('body').addClass(classes.IN_EDIT);
        }
    });

    $(document).on('click', `.${classes.IN_EDIT} .warpjs-inline-edit-context`, function() {
        const elementType = $(this).data('warpjsType');
        const elementId = $(this).data('warpjsId');

        switch (elementType) {
            case 'Paragraph':
            case 'Document':
            case 'Relationship':
                textModal($, this);
                break;

            default:
                warpjsUtils.toast.warning($, `Handling of {type:${elementType}, id:${elementId}}`, "TODO");
        }
    });
};
