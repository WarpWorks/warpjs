const moment = require('moment');

const bodyTemplate = require('./modal-body.hbs');

const { proxy, toast } = window.WarpJS;

const constants = {
    ACTION_SELECTOR: '[data-warpjs-action="change-logs"]',
    DIRTY: 'warpjsDataIsDirty',
    MODAL_SELECTOR: '[data-warpjs-modal="change-logs"]',
    TOAST_TITLE: "Change Logs"
};

class ChangeLogs {
    static init($, instanceDoc) {
        instanceDoc.on('click', constants.ACTION_SELECTOR, async () => {
            try {
                if (ChangeLogs.isDirty) {
                    const toastLoading = toast.loading($, "Updating change logs...", constants.TOAST_TITLE);
                    try {
                        const res = await proxy.get($, $(this).data('warpjsUrl'), true);
                        const content = bodyTemplate({ changeLogs: res._embedded.changeLogs });
                        $(`${constants.MODAL_SELECTOR} .modal-body`, instanceDoc).html(content);
                    } finally {
                        toast.close($, toastLoading);
                    }
                }

                // Make sure to update the time before displaying.
                $(`${constants.MODAL_SELECTOR} .warpjs-change-log-date-value`, instanceDoc).each((index, element) => {
                    const timestamp = $(element).data('warpjsTimestamp');
                    $(element).text(moment(timestamp).fromNow());
                });

                $(constants.MODAL_SELECTOR, instanceDoc).modal('show');
                ChangeLogs.clean();
            } catch (err) {
                toast.error($, "Trouble getting the change logs", constants.TOAST_TITLE);
            }
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
