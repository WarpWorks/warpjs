// eslint-disable-next-line no-unused-vars
import regeneratorRuntime from 'babel-regenerator-runtime';

import addGoogleAnalyticsIfNeeded from './add-google-analytics-if-needed';
import { init as pageHalInit } from './../components/page-hal/action-creators';
import createNewVersion from './../react-apps/create-new-version';
import documentEdition from './../react-apps/document-edition';
import followDocument from './../react-apps/follow-document';
import individualContributionHeader from './../react-apps/individual-contribution-header';
import reducers from './../components/reducers';
import userProfileMenu from './../react-apps/user-profile-menu';

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
    try {
        let result;

        try {
            result = await window.WarpJS.getCurrentPageHAL($);
        } catch (err) {
            console.error("Error contacting server:", err);
            window.WarpJS.toast.error($, err.message, "Error contacting server");
        }

        if (result.error) {
            $(window.WarpJS.CONTENT_PLACEHOLDER).html(window.WarpJS.error(result.data));
        } else {
            // Get everything ready for React.
            window.WarpJS.ReactUtils.initReactBootstrapDisplayNames();
            window.WarpJS.STORE = window.WarpJS.ReactUtils.createStore(reducers, {}, [], process.env.NODE_ENV === 'development');
            window.WarpJS.PAGE_HAL = window.WarpJS.flattenHAL(result.data);
            window.WarpJS.STORE.dispatch(pageHalInit(window.WarpJS.PAGE_HAL));

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

                individualContributionHeader();
            }

            panelItems($);
            inlineEdit($);
            tableOfContents($);
            actionGoto($);
            documentStatus($, result.data);

            window.WarpJS.displayCookiePopup(result.data.customMessages, result.data._links.acceptCookies);

            imageResizer($);
            addGoogleAnalyticsIfNeeded($);
            processSeparatorPanelItem($);

            // React components.
            followDocument($, result.data);
            userProfileMenu($, result.data);
            createNewVersion();
            documentEdition();
        }
    } catch (err) {
        // eslint-disable-next-line no-console
        console.error("Error processing response:", err);
        window.WarpJS.toast.error($, err.message, "Error processing response");
    }
}))(jQuery);
