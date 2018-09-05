module.exports = ($) => {
    $('#overview-toc-affix').each((i, element) => {
        $(element).affix({
            offset: {
                top: function() {
                    return (this.top = $(element).offset().top);
                }
            }
        });
    });

    $('#overview-toc-modal .modal-body .toc-item').on('click', function() {
        const targetId = $(this).data('warpjsId');
        const target = $(`#toc-${targetId}`).get(0);
        if (target) {
            target.scrollIntoView(true);
        }
    });
};
