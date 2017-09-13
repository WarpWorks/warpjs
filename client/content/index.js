const initializeWarpJS = require('./initialize');
const loadingTemplate = require('./templates/loading.hbs');
const renderer = require('./template-renderer');

function initialized() {
    // eslint-disable-next-line no-console
    console.log("index.initialized(): Initialization successful!");
}

renderer(loadingTemplate, {});

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
