module.exports = ($, element, popover, result, popoverOffset) => {
    const chunks = (result.content || '').split('<br />'); // Tinymce dependent.

    $('.popover-content', popover).css({
        maxHeight: '110px',
        textOverflow: 'ellipsis',
        overflow: 'hidden'
    });

    $('.popover-title', popover).html(
        '<span class="close pull-right" data-dismiss="popover" aria-label="Close" aria-hidden="true">×</span>' +
        result.title
    );
    $('.popover-content', popover).html(chunks[0]);

    if (popoverOffset) {
        const popoverLeft = Math.max(0, popoverOffset.left - Math.floor(popover.width() / 2));
        const popoverTop = Math.max(0, popoverOffset.top - Math.floor(popover.height()));
        popover.offset({
            left: popoverLeft,
            top: popoverTop
        });
    } else {
        const thisOffset = $(element).offset();
        const popoverTop = Math.max(0, Math.floor(thisOffset.top) - Math.floor(popover.height()) - 25);
        popover.offset({
            top: popoverTop
        });
    }
};
