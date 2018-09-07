module.exports = ($, instanceDoc) => {
    if (!instanceDoc) {
        instanceDoc = $(document);
    }
    instanceDoc.on('click', '[data-warpjs-action="goto"][data-warpjs-url]:not([disabled])', function() {
        document.location.href = $(this).data('warpjsUrl');
    });
};
