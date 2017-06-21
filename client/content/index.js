const initializeWarpJS = require('./initialize');

function initialized() {
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
