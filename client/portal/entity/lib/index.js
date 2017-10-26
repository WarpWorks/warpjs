const warpjsUtils = require('@warp-works/warpjs-utils');

const cache = require('./../../../cache');
const preview = require('./../../preview');

const template = require("./../templates/index.hbs");

const errorTemplate = warpjsUtils.requirePartial('error-portal');

(($) => {
    $(document).ready(() => {
        warpjsUtils.getCurrentPageHAL($)
            .then((result) => {
                const content = (result.error) ? errorTemplate(result.data) : template(result.data);
                if (!result.error && result.data && result.data.Name) {
                    document.title = result.data.Name;
                }

                result.data._embedded.previews.forEach((preview) => {
                    cache.set(preview._links.preview.href, {
                        title: preview.title,
                        content: preview.content
                    });
                });

                $('#warpjs-content-placeholder').html(content);

                preview($);
            });
    });
})(jQuery);
