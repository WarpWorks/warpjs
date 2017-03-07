const utils = require('./../../utils');

const template = require("./../templates/index.hbs");

(($) => {
    $(document).ready(() => {
        utils.getCurrentPageHAL($)
            .then((result) => {
                console.log("initial load: data=", result.data);

                const content = template(result.data);

                $('#i3c-portal-placeholder').html(content);
            });
    });
})(jQuery);
