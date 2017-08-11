const warpjsUtils = require('@warp-works/warpjs-utils');

const progressBarModal = require('./../progress-bar-modal');
const mainPanelBodyTemplate = require('./main-panel-body.hbs');

module.exports = ($, result) => {
    console.log("entity.postRender(): result=", result);
    progressBarModal.show($, 75);

    // Fetching the schema
    const instance = result.data._embedded.instances[0];

    return warpjsUtils.getCurrentPageHAL($, result.data._links.schema.href)
        .then((schemaResult) => {
            const pageView = schemaResult.data.pageView;
            console.log("pageView=", pageView);

            const data = {
                instance
            };

            if (pageView.children.length === 1) {
                data.panel = pageView.children[0];
            } else {
                data.panels = pageView.children;
            }

            const content = mainPanelBodyTemplate(data);
            $('#WarpJS_mainPV_panel .panel-body').html(content);

            progressBarModal.hide();
        });
};
