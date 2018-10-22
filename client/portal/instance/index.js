const Promise = require('bluebird');

const actionGoto = require('./../../shared/action-goto');
const documentStatus = require('./../document-status');
const inlineEdit = require('./../inline-edit');
const preview = require('./../preview');
const tableOfContents = require('./../table-of-contents');
const template = require('./template.hbs');
const panelItems = require('./panel-items');
const imageResizer = require('./image-resizer');

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

                panelItems($);
                inlineEdit($);
                tableOfContents($);
                actionGoto($);
                documentStatus($, result.data);

                window.WarpJS.displayCookiePopup(result.data.customMessages, result.data._links.acceptCookies);

                // const React = require('react');
                // const ReactDOM = require('react-dom');
                // const Community = require('./community/component.jsx');
                //
                // const communityPlaceholder = document.getElementById('warpjs-sidebar-community');
                // if (communityPlaceholder) {
                //     const data = result.data;
                //     const pages = (data && data._embedded && data._embedded.pages) ? data._embedded.pages : null;
                //     const page = (pages && pages.length) ? pages[0] : null;
                //     const pageViews = (page && page._embedded && page._embedded.pageViews) ? page._embedded.pageViews : null;
                //     const pageView = (pageViews && pageViews.length) ? pageViews[0] : null;
                //     const communities = (pageView && pageView._embedded && pageView._embedded.communities) ? pageView._embedded.communities : null;
                //     const community = (communities && communities.length) ? communities[0] : null;

                //     if (community) {
                //         ReactDOM.render(<Community page={page} community={community} />, communityPlaceholder);
                //     }
                // }

                imageResizer($);
            }
        },
        (err) => {
            console.err("Error processing response:", err);
            window.WarpJS.toast.error($, err.message, "Error contacting server");
        }
    )
    .catch((err) => window.WarpJS.toast.error($, err.message, "Error processing response"))
))(jQuery);
