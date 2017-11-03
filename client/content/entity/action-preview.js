module.exports = ($, instanceDoc) => {
    instanceDoc.on('click', '[data-warpjs-action="preview"][data-warpjs-url]:not([disabled])', function() {
        document.location.href = $(this).data('warpjsUrl');
    });
};
