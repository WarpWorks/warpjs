module.exports = ($, instanceDoc) => {
    instanceDoc.on('click', '[data-warpjs-action="change-logs"]', function() {
        $('[data-warpjs-modal="change-logs"]', instanceDoc).modal('show');
    });
};
