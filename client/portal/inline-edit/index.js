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
};
