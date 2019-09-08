import { reactApps, reducers } from './components';
import { init } from './../components';

const ProgressBarModal = require('@warp-works/progress-bar-modal');

const renderer = require('./template-renderer');

const { flattenHAL } = window.WarpJS;
const { createStore, initReactBootstrapDisplayNames } = window.WarpJS.ReactUtils;

function defaultPostRender($, result) {
    ProgressBarModal.show($, 100);
    ProgressBarModal.hide();
}

function defaultOnError($, err) {
    console.error("ERROR:", err);
    ProgressBarModal.hide();
    window.WarpJS.toast.error($, err.message, "Error initial load");
}

module.exports = ($, template, postRender = defaultPostRender, onError = defaultOnError) => {
    // Offer a render quickly then go fetch the data and update the page.
    ProgressBarModal.show($, 25);

    $(document).ready(async () => {
        let result;

        try {
            result = await window.WarpJS.getCurrentPageHAL($);
        } catch (err) {
            console.error(`Error contacting server:`, err);
            onError($, err);
        }

        if (result.error) {
            onError($, result);
        } else if (result) {
            ProgressBarModal.show($, 50);

            renderer(template, result);
            postRender($, result);

            //
            //  Getting React ready
            //
            initReactBootstrapDisplayNames();
            //  eslint-disable-next-line require-atomic-updates
            window.WarpJS.STORE = createStore(reducers, {}, [], process.env.NODE_ENV === 'development');
            //  eslint-disable-next-line require-atomic-updates
            window.WarpJS.PAGE_HAL = flattenHAL(result.data);
            window.WarpJS.STORE.dispatch(init(window.WarpJS.PAGE_HAL));

            reactApps();
        }
    });
};
