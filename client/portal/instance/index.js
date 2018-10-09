// const _ = require('lodash');
const Promise = require('bluebird');

const actionGoto = require('./../../shared/action-goto');
const documentStatus = require('./../document-status');
const inlineEdit = require('./../inline-edit');
const preview = require('./../preview');
const tableOfContents = require('./../table-of-contents');
const template = require('./template.hbs');
const vocabulary = require('./../vocabulary');

(($) => $(document).ready(() => Promise.resolve()
    .then(() => window.WarpJS.getCurrentPageHAL($))
    .then(
        (result) => {
            if (result.error) {
                $(window.WarpJS.CONTENT_PLACEHOLDER).html(window.WarpJS.error(result.data));
            } else {
                $(window.WarpJS.CONTENT_PLACEHOLDER).html(template(result.data));

                if (result.data && result.data._embedded && result.data._embedded.pages) {
                    const page = result.data._embedded.pages[0];

                    if (page && page.name) {
                        document.title = page.name;
                    }

                    if (page && page._embedded && page._embedded.previews) {
                        page._embedded.previews.forEach((preview) => window.WarpJS.cache.set(preview._links.preview.href, {
                            title: preview.title,
                            content: preview.content
                        }));
                    }

                    preview($);
                }

                vocabulary($);
                inlineEdit($);
                tableOfContents($);
                actionGoto($);
                documentStatus($, result.data);

                window.WarpJS.displayCookiePopup(result.data.customMessages, result.data._links.acceptCookies);
            }
        },
        (err) => window.WarpJS.toast.error($, err.message, "Error contacting server")
    )
    .catch((err) => window.WarpJS.toast.error($, err.message, "Error processing response"))
))(jQuery);
