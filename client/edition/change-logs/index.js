const moment = require('moment');
const Promise = require('bluebird');
const { proxy, toast } = require('@warp-works/warpjs-utils');

const bodyTemplate = require('./modal-body.hbs');

const constants = {
    ACTION_SELECTOR: '[data-warpjs-action="change-logs"]',
    DIRTY: 'warpjsDataIsDirty',
    MODAL_SELECTOR: '[data-warpjs-modal="change-logs"]'
};

class ChangeLogs {
    static init($, instanceDoc) {
        ChangeLogs.instanceDoc = instanceDoc;

        instanceDoc.on('click', constants.ACTION_SELECTOR, function() {
            Promise.resolve()
                .then(() => ChangeLogs.isDirty
                    ? Promise.resolve()
                        .then(() => toast.loading($, "Updating change logs...", "Change Logs"))
                        .then((toastLoading) => Promise.resolve()
                            .then(() => proxy.get($, $(this).data('warpjsUrl'), true))
                            .then((res) => bodyTemplate({ changeLogs: res._embedded.changeLogs }))
                            .then((content) => $(`${constants.MODAL_SELECTOR} .modal-body`, instanceDoc).html(content))
                            .then(() => toast.close($, toastLoading))
                        )
                    : null
                )
                .then(() => {
                    // Make sure to update the time before displaying.
                    $(`${constants.MODAL_SELECTOR} .warpjs-change-log-date-value`, instanceDoc).each((index, element) => {
                        const timestamp = $(element).data('warpjsTimestamp');
                        $(element).text(moment(timestamp).fromNow());
                    });
                })
                .then(() => $(constants.MODAL_SELECTOR, instanceDoc).modal('show'))
                .then(() => instanceDoc.data(constants.DIRTY, false))
                .catch(() => toast.error($, "Trouble getting the history", "Change Logs"))
            ;
        });
    }

    static get isDirty() {
        return ChangeLogs.instanceDoc.data(constants.DIRTY);
    }

    static dirty() {
        ChangeLogs.instanceDoc.data(constants.DIRTY, true);
    }
}

module.exports = ChangeLogs;
