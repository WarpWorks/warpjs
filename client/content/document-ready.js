const warpjsUtils = require('@warp-works/warpjs-utils');

const renderer = require('./template-renderer');
const loadingTemplate = require('./templates/loading.hbs');

function defaultPostRender(result) {
    console.log("no post-renderer defined");
}

function defaultOnError(err) {
    console.log("ERROR:", err);
}

module.exports = ($, template, postRender = defaultPostRender, onError = defaultOnError) => {
    // Offer a render quickly then go fetch the data and update the page.
    renderer(loadingTemplate, {});

    $(document).ready(() => {
        warpjsUtils.getCurrentPageHAL($)
            .then((result) => {
                if (result.error) {
                    return onError(result);
                }
                return renderer(template, result);
            })
            .then(postRender)
            .catch(onError);
    });
};
