const moment = require('moment');
const Promise = require('bluebird');

const bodyTemplate = require('./modal-body.hbs');

const constants = {
    ACTION_SELECTOR: '[data-warpjs-action="change-logs"]',
    DIRTY: 'warpjsDataIsDirty',
    MODAL_SELECTOR: '[data-warpjs-modal="change-logs"]',
    TOAST_TITLE: "Change Logs"
};

class ChangeLogs {
    static init($, instanceDoc) {
        instanceDoc.on('click', constants.ACTION_SELECTOR, function() {
            Promise.resolve()
                .then(() => ChangeLogs.isDirty
                    ? Promise.resolve()
                        .then(() => window.WarpJS.toast.loading($, "Updating change logs...", constants.TOAST_TITLE))
                        .then((toastLoading) => Promise.resolve()
                            .then(() => window.WarpJS.proxy.get($, $(this).data('warpjsUrl'), true))
                            .then((res) => bodyTemplate({ changeLogs: res._embedded.changeLogs }))
                            .then((content) => $(`${constants.MODAL_SELECTOR} .modal-body`, instanceDoc).html(content))
                            .then(() => window.WarpJS.toast.close($, toastLoading))
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
                .then(() => ChangeLogs.clean())
                .catch(() => window.WarpJS.toast.error($, "Trouble getting the change logs", constants.TOAST_TITLE))
            ;
        });
    }

    static get isDirty() {
        return $(constants.ACTION_SELECTOR).data(constants.DIRTY);
    }

    static dirty() {
        $(constants.ACTION_SELECTOR).data(constants.DIRTY, true);
    }

    static clean() {
        $(constants.ACTION_SELECTOR).data(constants.DIRTY, false);
    }
}

module.exports = ChangeLogs;
