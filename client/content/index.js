const initializeWarpJS = require('./initialize');

const documentReady = require('./document-ready');

function initialized() {
    // eslint-disable-next-line no-console
    console.log("index.initialized(): Initialization successful!");
}

(($) => {
    $(document).ready(() => {
        const config = {
            viewName: "DefaultPageView",
            htmlElements: {
                rootElem: "warpPageRoot",
                saveButton: "NavButtonSaveA"
            }
        };

        initializeWarpJS(config, initialized);
    });
})(jQuery);
