const Promise = require('bluebird');

const bodyTemplate = require('./body.hbs');

const constants = {
    HAS_POPOVER: 'warpjs-element-has-popover'
};

module.exports = ($, element) => new Promise((resolve, reject) => {
    // Remove any existing popover.
    $(`.${constants.HAS_POPOVER}`).popover('destroy');

    const popoverOptions = {
        html: true,
        placement: 'auto',
        title: `Delete confirmation`,
        content: bodyTemplate()
    };

    $(element).addClass(constants.HAS_POPOVER);
    $(element).popover(popoverOptions);
    $(element).popover('show');

    $(`.popover.in .popover-content [data-warpjs-action="confirm-delete"]`).on('click', function() {
        $(element).popover('destroy');
        resolve(true);
    });

    $(`.popover.in .popover-content [data-warpjs-action="cancel-delete"]`).on('click', function() {
        resolve(false);
        $(element).popover('destroy');
    });
});
