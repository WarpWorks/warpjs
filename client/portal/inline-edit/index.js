const associationModal = require('./association-modal');
const comingSoon = require('./coming-soon');
const textModal = require('./text-modal');

const classes = Object.freeze({
    IN_EDIT: 'warpjs-inline-edit-global-in-edit'
});

module.exports = ($) => {
    $(document).on('click', '[data-warpjs-action="inline-edit-toggle"]', function() {
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
                textModal($, this);
                break;

            case 'Relationship':
                associationModal($, this);
                break;

            default:
                console.log(`Handling of {type:${elementType}, id:${elementId}}`);
                comingSoon($, "This functionality is coming soon.");
        }
    });
};
