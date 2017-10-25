const proxy = require('./../../content/proxy');

module.exports = ($) => {
    $('[data-warpjs-action="preview"][data-warpjs-preview-url]')
        .on('mouseenter', function() {
            let popoverOffset;

            const coordsValue = $(this).attr('coords');
            if (coordsValue) {
                const coords = coordsValue.split(',');
                // This depends on the DOM.
                const imageOffset = $(this).closest('figure').children('img').offset();

                const left = parseInt(coords[0], 10);
                const top = parseInt(coords[1], 10);

                popoverOffset = {
                    left: left + Math.floor(imageOffset.left),
                    top: top + Math.floor(imageOffset.top)
                };
            }

            const popoverOptions = {
                html: true,
                placement: 'top',
                trigger: 'hover focus',
                title: "Loading..."
            };
            $(this).data('toggle', 'popover');
            $(this).popover(popoverOptions);
            $(this).popover('show');

            const popover = $('.popover.in');

            proxy.get($, $(this).data('warpjsPreviewUrl'))
                .then((result) => {
                    const chunks = (result.content || '').split('<br />'); // Tinymce dependent.

                    $('.popover-title', popover).html(result.title);
                    $('.popover-content', popover).html(chunks[0]);

                    $('.popover-content', popover).css({
                        maxHeight: '200px',
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                        maxWidth: '250px'
                    });

                    if (popoverOffset) {
                        const popoverLeft = Math.max(0, popoverOffset.left - Math.floor(popover.width() / 2));
                        const popoverTop = Math.max(0, popoverOffset.top - Math.floor(popover.height()));
                        popover.offset({
                            left: popoverLeft,
                            top: popoverTop
                        });
                    }
                })
            ;
        })
    ;
};
