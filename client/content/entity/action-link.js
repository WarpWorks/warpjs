module.exports = ($, instanceDoc) => {
    instanceDoc.on('click', '[data-warpjs-action="link"][data-warpjs-url]', function() {
        document.location.href = $(this).data('warpjsUrl');
    });
};
