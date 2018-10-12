const _ = require('lodash');
const Promise = require('bluebird');

const BASE_POPOVER_OPTIONS = Object.freeze({
    html: true,
    placement: 'top',
    trigger: 'hover focus',
    container: 'body'
});
const INITIALIZED = 'warpjsPopoverInitialized';
const CSS = Object.freeze({
    maxHeight: '110px',
    overflow: 'hidden'
});

function position(popover, evt) {
    const currentTarget = evt.currentTarget;
    const svg = $(currentTarget).closest('svg');
    const svgOffset = svg.offset();

    const left = Math.max(0, svgOffset.left + evt.offsetX - (popover.width() / 2));
    const top = Math.max(0, svgOffset.top + evt.offsetY - popover.height() - 20);
    popover.offset({left, top});
}

function findPopover($) {
    const popover = $('.popover.in');
    $('.popover-content', popover).css(CSS);
    return popover;
}

module.exports = ($) => {
    $(document).on('mousemove', '[data-warpjs-action="preview"][data-warpjs-preview-url]', _.throttle((evt) => {
        const popover = findPopover($);
        position(popover, evt);
    }, 20));

    $(document).on('mouseenter', '[data-warpjs-action="preview"][data-warpjs-preview-url]', function(evt) {
        if ($(this).data(INITIALIZED)) {
            $(this).popover('show');

            const popover = findPopover($);
            position(popover, evt);
        } else {
            Promise.resolve()
                .then(() => window.WarpJS.proxy.get($, $(this).data('warpjsPreviewUrl')))
                .then((result) => Promise.resolve()
                    .then(() => {
                        // Tinymce dependent.
                        const chunks = (result.content || '').split('<br />');

                        const title = `<span class="close pull-right" data-dismiss="popover" aria-label="Close" aria-hidden="true">×</span>${result.title}`;
                        const content = chunks[0];

                        const popoverOptions = _.extend({}, BASE_POPOVER_OPTIONS, { title, content });

                        $(this).popover(popoverOptions);
                        $(this).popover('show');

                        const popover = findPopover($);
                        $('[data-dismiss="popover"]', popover).on('click', () => popover.popover('hide'));

                        if ($(this).hasClass('map-hover-area')) {
                            position(popover, evt);
                        }
                    })
                )
                .catch(() => {
                    const popoverOptions = _.extend({}, BASE_POPOVER_OPTIONS, {
                        title: "Trouble loading preview",
                        content: `<div class="alert alert-danger">Issue loading preview page</div>`
                    });

                    $(this).popover(popoverOptions);
                    $(this).popover('show');

                    findPopover($);
                })
                .finally(() => {
                    $(this).data(INITIALIZED, true);
                })
            ;
        }
    });
};
