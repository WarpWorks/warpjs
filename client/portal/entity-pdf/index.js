/// import _debug from './debug'; const debug = _debug('index');

const template = require('./template.hbs');

console.log('got to js on frontend');
(($) => $(document).ready(async () => {
    // try {
    //     let result;

    //     try {
    //         result = await window.WarpJS.getCurrentPageHAL($);
    //     } catch (err) {
    //         console.error("Error contacting server:", err);
    //         window.WarpJS.toast.error($, err.message, "Error contacting server");
    //     }

            $(window.WarpJS.CONTENT_PLACEHOLDER).html(template({}));

            // if (result.data && result.data._embedded && result.data._embedded.pages) {
            //     const page = result.data._embedded.pages[0];

            //     if (page && page.name) {
            //         document.title = page.name;
            //     }

            //     if (page && page._embedded && page._embedded.previews) {
            //         page._embedded.previews.forEach((preview) => window.WarpJS.cache.set(preview._links.preview.href, {
            //             title: preview.title,
            //             content: preview.content
            //         }));
            //     }

            //     preview($);

            //     individualContributionHeader();
            // }

            // panelItems($);
            // inlineEdit($);
            // tableOfContents($);
            // actionGoto($);
            // documentStatus($, result.data);

            // window.WarpJS.displayCookiePopup(result.data.customMessages, result.data._links.acceptCookies);

            // imageResizer($);
            // addGoogleAnalyticsIfNeeded($);
            // processSeparatorPanelItem($);

            // // React components.
            // followDocument($, result.data);
            // userProfileMenu($, result.data);
            // documentEdition();
    //     }
    // } catch (err) {
    //     // eslint-disable-next-line no-console
    //     console.error("Error processing response:", err);
    //     window.WarpJS.toast.error($, err.message, "Error processing response");
    // }
}))(jQuery);
