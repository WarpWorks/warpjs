const moment = require('moment');

module.exports = ($, instanceDoc) => {
    instanceDoc.on('click', '[data-warpjs-action="change-logs"]', function() {
        // Make sure to update the time before displaying.
        $('[data-warpjs-modal="change-logs"] .warpjs-change-log-date-value', instanceDoc).each((index, element) => {
            const timestamp = $(element).data('warpjsTimestamp');
            $(element).text(moment(timestamp).fromNow());
        });
        $('[data-warpjs-modal="change-logs"]', instanceDoc).modal('show');
    });
};
