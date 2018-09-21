const _ = require('lodash');
const Promise = require('bluebird');

module.exports = ($, element, baseData = {}) => Promise.resolve()
    .then(() => window.WarpJS.toast.loading($, "This can take few seconds. Page will redirect when done.", "Processing..."))
    .then((toastLoading) => Promise.resolve()
        .then(() => _.cloneDeep(baseData))
        .then((dataToPost) => _.extend(dataToPost, {
            warpjsAction: $(element).data('warpjsAction')
        }))
        .then((dataToPost) => window.WarpJS.proxy.post($, $(element).data('warpjsUrl'), dataToPost))
        .then((res) => {
            document.location.href = res._links.redirect.href;
        })
        .catch((err) => {
            console.error("post-and-redirect error: err=", err);
            window.WarpJS.toast.close($, toastLoading);
            window.WarpJS.toast.error($, err.message, "Action error");
        })
    )
;
