module.exports = ($) => {
    $('#overview-toc-affix').each((i, element) => {
        $(element).affix({
            offset: {
                top: function() {
                    return (this.top = $(element).offset().top);
                },

                bottom: function() {
                    return (this.bottom = $('.page--footer').outerHeight(true) + $('#overview-toc-affix').outerHeight(true));
                }
            }
        });
    });

    $('#overview-toc-modal .modal-body .toc-item').on('click', function() {
        const href = $(this).data('warpjsUrl');
        if (href) {
            document.location.href = href;
        } else {
            const targetId = $(this).data('warpjsId');
            const target = $(`#toc-${targetId}`).get(0);
            if (target) {
                target.scrollIntoView(true);
            }
        }
    });

    $(document).on('affixed.bs.affix', function() {
        $('#overview-toc-affix').removeAttr('style');
    });
};
