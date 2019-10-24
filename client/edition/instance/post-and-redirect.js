const cloneDeep = require('lodash/cloneDeep');
const extend = require('lodash/extend');
const Promise = require('bluebird');

const { proxy, toast } = window.WarpJS;

module.exports = ($, element, baseData = {}) => Promise.resolve()
    .then(() => toast.loading($, "This can take few seconds. Page will redirect when done.", "Processing..."))
    .then((toastLoading) => Promise.resolve()
        .then(() => cloneDeep(baseData))
        .then((dataToPost) => extend(dataToPost, {
            warpjsAction: $(element).data('warpjsAction')
        }))
        .then((dataToPost) => proxy.post($, $(element).data('warpjsUrl'), dataToPost))
        .then((res) => {
            document.location.href = res._links.redirect.href;
        })
        .catch((err) => {
            console.error("post-and-redirect error: err=", err);
            toast.close($, toastLoading);
            toast.error($, err.message, "Action error");
        })
    )
;
