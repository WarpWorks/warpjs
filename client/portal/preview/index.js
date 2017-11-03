const _ = require('lodash');

const proxy = require('./../../proxy');

module.exports = ($) => {
    $('[data-warpjs-action="preview"][data-warpjs-preview-url]')
        .on('mouseenter', function() {
            let popoverOffset;

            const popoverOptions = {
                html: true,
                placement: 'top',
                trigger: 'hover focus',
                title: "Loading...",
                content: '<span class="text-warning">Please wait while loading data...</span>'
            };

            $(this).data('toggle', 'popover');

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

                $(this).popover(popoverOptions);
            } else {
                $(this).popover(_.extend({}, popoverOptions, {placement: 'auto'}));
            }

            $(this).popover('show');

            const popover = $('.popover.in');

            proxy.get($, $(this).data('warpjsPreviewUrl'))
                .then((result) => {
                    const chunks = (result.content || '').split('<br />'); // Tinymce dependent.

                    $('.popover-content', popover).css({
                        maxHeight: '200px',
                        textOverflow: 'ellipsis',
                        overflow: 'hidden'
                    });

                    $('.popover-title', popover).html(result.title);
                    $('.popover-content', popover).html(chunks[0]);

                    if (popoverOffset) {
                        const popoverLeft = Math.max(0, popoverOffset.left - Math.floor(popover.width() / 2));
                        const popoverTop = Math.max(0, popoverOffset.top - Math.floor(popover.height()));
                        popover.offset({
                            left: popoverLeft,
                            top: popoverTop
                        });
                    } else {
                        const thisOffset = $(this).offset();
                        const popoverTop = Math.max(0, Math.floor(thisOffset.top) - Math.floor(popover.height()) - 25);
                        popover.offset({
                            top: popoverTop
                        });
                    }
                })
                .catch(() => {
                    $('.popover-title', popover).html("Trouble loading preview");
                    $('.popover-content', popover).html(`<div class="alert alert-danger">Issue loading preview page</div>`);
                })
            ;
        })
    ;
};
