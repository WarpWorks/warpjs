const utils = require('./../../utils');

const errorTemplate = require('./../../common/templates/_error.hbs');
const template = require("./../templates/index.hbs");

(($) => {
    $(document).ready(() => {
        utils.getCurrentPageHAL($)
            .then((result) => {
                let content;

                if (result.error) {
                    content = errorTemplate(result.data);
                } else {
                    console.log("initial load: data=", result.data);
                    content = template(result.data);
                }
                $('#i3c-portal-placeholder').html(content);
            });
    });
})(jQuery);
