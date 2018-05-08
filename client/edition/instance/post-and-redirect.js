const Promise = require('bluebird');
const { proxy, toast } = require('@warp-works/warpjs-utils');

module.exports = ($, element) => Promise.resolve()
    .then(() => toast.loading($, "This can take few seconds. Page will redirect when done.", "Processing..."))
    .then((toastLoading) => Promise.resolve()
        .then(() => ({
            warpjsAction: $(element).data('warpjsAction')
        }))
        .then((data) => proxy.post($, $(element).data('warpjsUrl'), data))
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
