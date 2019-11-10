import Promise from 'bluebird';

import constants from './../../constants';

import bodyTemplate from './body.hbs';

// import _debug from './debug'; const debug = _debug('index');

module.exports = async ($, element, position = 'auto') => new Promise((resolve, reject) => {
    // Remove any existing popover.
    $(`.${constants.HAS_POPOVER}`).popover('destroy');

    const popoverOptions = {
        html: true,
        placement: position,
        title: `Delete confirmation`,
        content: bodyTemplate(),
        sanitize: false
    };

    $(element).addClass(constants.HAS_POPOVER);
    $(element).popover(popoverOptions);
    $(element).popover('show');

    $(`.popover.in .popover-content [data-warpjs-action="confirm-delete"]`).on('click', function() {
        $(element).popover('destroy');
        resolve(true);
    });

    $(`.popover.in .popover-content [data-warpjs-action="cancel-delete"]`).on('click', function() {
        $(element).popover('destroy');
        resolve(false);
    });
});
