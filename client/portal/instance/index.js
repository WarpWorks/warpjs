const Promise = require('bluebird');
const warpjsUtils = require('@warp-works/warpjs-utils');

const inlineEdit = require('./../inline-edit');
const preview = require('./../preview');
const template = require('./template.hbs');
const vocabulary = require('./../vocabulary');

const errorTemplate = warpjsUtils.requirePartial('error-portal');

(($) => $(document).ready(() => Promise.resolve()
    .then(() => warpjsUtils.getCurrentPageHAL($))
    .then(
        (result) => {
            if (result.error) {
                $(warpjsUtils.constants.CONTENT_PLACEHOLDER).html(errorTemplate(result.data));
            } else {
                $(warpjsUtils.constants.CONTENT_PLACEHOLDER).html(template(result.data));

                if (result.data && result.data._embedded && result.data._embedded.pages) {
                    const page = result.data._embedded.pages[0];

                    if (page && page.name) {
                        document.title = page.name;
                    }

                    if (page && page._embedded && page._embedded.previews) {
                        page._embedded.previews.forEach((preview) => warpjsUtils.cache.set(preview._links.preview.href, {
                            title: preview.title,
                            content: preview.content
                        }));
                    }

                    preview($);
                }

                vocabulary($);
                inlineEdit($);

                warpjsUtils.documentReady($);
            }
        },
        (err) => {
            warpjsUtils.toast.error($, err.message, "Error contacting server");
        }
    )
    .catch((err) => {
        warpjsUtils.toast.error($, err.message, "Error processing response");
    })
))(jQuery);
