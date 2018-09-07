// const _ = require('lodash');
const Promise = require('bluebird');
const warpjsUtils = require('@warp-works/warpjs-utils');

const actionGoto = require('./../../shared/action-goto');
const inlineEdit = require('./../inline-edit');
const preview = require('./../preview');
const tableOfContents = require('./../table-of-contents');
const template = require('./template.hbs');
const vocabulary = require('./../vocabulary');

const errorTemplate = warpjsUtils.requirePartial('error-portal');

// let initialViewportHeight;
//
// function putFooterAtBottom($) {
//     $('body').css('padding-bottom', 0);
//
//     if (!initialViewportHeight) {
//         initialViewportHeight = $(window).height();
//     }
//
//     const documentHeight = $(document).height();
//
//     console.log(`window:`, $(window).height(), '; document:', $(document).height());
//
//
//     if (documentHeight < initialViewportHeight) {
//         const footerHeight = $('.page--footer').outerHeight(true);
//         $('body').css({
//             'padding-bottom': `${footerHeight}px`,
//             'min-height': '100vh',
//         });
//
//         $('.page--footer').css({
//             'position': 'absolute',
//             'bottom': 0
//         });
//     } else {
//         $('.page--footer').css({
//             'position': 'relative'
//         });
//     }
//
// }

(($) => $(document).ready(() => Promise.resolve()
    // .then(() => {
    //     putFooterAtBottom($);
    //     $(window).on('resize', _.throttle(function() { putFooterAtBottom($); }, 200));
    // })
    .then(() => warpjsUtils.getCurrentPageHAL($))
    .then(
        (result) => {
            if (result.error) {
                $(warpjsUtils.constants.CONTENT_PLACEHOLDER).html(errorTemplate(result.data));
                // putFooterAtBottom($);
            } else {
                $(warpjsUtils.constants.CONTENT_PLACEHOLDER).html(template(result.data));

                // putFooterAtBottom($);

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
                tableOfContents($);
                actionGoto($);

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
