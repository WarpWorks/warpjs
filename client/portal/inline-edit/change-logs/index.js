const moment = require('moment');
const Promise = require('bluebird');

const bodyTemplate = require('./modal-body.hbs');

const constants = {
    ACTION_SELECTOR: '[data-warpjs-action="inline-edit-history"]',
    DIRTY: 'warpjsDataIsDirty',
    MODAL_SELECTOR: '[data-warpjs-modal="change-logs"]',
    TOAST_TITLE: "Change Logs"
};

class ChangeLogs {
    static init($, res, instanceDoc, element) {
        $(document).on('click', constants.ACTION_SELECTOR, function(event) {
            event.preventDefault();
            Promise.resolve()
                .then(() => ChangeLogs.isDirty
                    ? Promise.resolve()
                        .then(() => window.WarpJS.toast.loading($, "Updating change logs...", constants.TOAST_TITLE))
                        .then((toastLoading) => Promise.resolve()
                            .then(() => { return {
                                elementType: $(element).data('warpjsType'),
                                elementId: $(element).data('warpjsId'),
                                reference: {
                                    type: $(element).data('warpjsReferenceType'),
                                    id: $(element).data('warpjsReferenceId')
                                }
                            };})
                            .then((data) => window.WarpJS.proxy.post($, $(element).data('warpjsUrl'), data))
                            .then((res) => bodyTemplate({ changeLogs: res._embedded.changeLogs }))
                            .then((content) => $('.warpjs-detail-container .warpjs-placeholder').html(content))
                            .then(() => window.WarpJS.toast.close($, toastLoading))
                        )
                    : Promise.resolve()
                        .then(() => bodyTemplate({ changeLogs: res._embedded.changeLogs }))
                        .then((content) => $('.warpjs-detail-container .warpjs-placeholder').html(content))
                )
                .then(() => {
                    // Make sure to update the time before displaying.
                    $('.history-container .warpjs-change-log-date-value').each((index, element) => {
                        const timestamp = $(element).data('warpjsTimestamp');
                        $(element).text(moment(timestamp).fromNow());
                    });
                })
                .then(() => $(constants.MODAL_SELECTOR, instanceDoc).modal('show'))
                .then(() => ChangeLogs.clean())
                .catch(() => window.WarpJS.toast.error($, "Trouble getting the change logs", constants.TOAST_TITLE))
            ;
        });

        $(document).on('click', '.back-to-edit', (event) => {
            event.preventDefault();
            $('.warpjs-list-item-selected .warpjs-list-item-value').trigger('click');
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
