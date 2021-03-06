// eslint-disable-next-line no-unused-vars
import regeneratorRuntime from 'babel-regenerator-runtime';

import addGoogleAnalyticsIfNeeded from './add-google-analytics-if-needed';
import reactApps from './../react-apps';

/// import _debug from './debug'; const debug = _debug('index');

const actionGoto = require('./../../shared/action-goto');
const documentStatus = require('./../document-status');
const imageResizer = require('./image-resizer');
const inlineEdit = require('./../inline-edit');
const panelItems = require('./panel-items');
const preview = require('./../preview');
const processSeparatorPanelItem = require('./process-separator-panel-item');
const tableOfContents = require('./../table-of-contents');
const template = require('./template.hbs');

(($) => $(document).ready(async () => {
    const { cache, CONTENT_PLACEHOLDER, displayCookiePopup, error, getCurrentPageHAL, toast } = window.WarpJS;
    try {
        let result;

        try {
            result = await getCurrentPageHAL($);
        } catch (err) {
            console.error("Error contacting server:", err);
            toast.error($, err.message, "Error contacting server");
        }

        if (result.error) {
            $(CONTENT_PLACEHOLDER).html(error(result.data));
        } else {
            $(CONTENT_PLACEHOLDER).html(template(result.data));

            if (result.data && result.data._embedded && result.data._embedded.pages) {
                const page = result.data._embedded.pages[0];

                if (page && page.name) {
                    document.title = page.name;
                }

                if (page && page._embedded && page._embedded.previews) {
                    page._embedded.previews.forEach((preview) => cache.set(preview._links.preview.href, {
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

            displayCookiePopup(result.data.customMessages, result.data._links.acceptCookies);

            imageResizer($);
            addGoogleAnalyticsIfNeeded($);
            processSeparatorPanelItem($);

            // React components.
            reactApps($, result.data);
        }
    } catch (err) {
        // eslint-disable-next-line no-console
        console.error("Error processing response:", err);
        toast.error($, err.message, "Error processing response");
    }
}))(jQuery);
