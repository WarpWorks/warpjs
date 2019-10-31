import extend from 'lodash/extend';
import Promise from 'bluebird';
import throttle from 'lodash/throttle';

// import _debug from './debug'; const debug = _debug('index');

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

    if (svgOffset) {
        const left = Math.max(0, svgOffset.left + evt.offsetX - (popover.width() / 2));
        const top = Math.max(0, svgOffset.top + evt.offsetY - popover.height() - 20);
        popover.offset({ left, top });
    }
}

function findPopover($) {
    const popover = $('.popover.in');
    $('.popover-content', popover).css(CSS);
    return popover;
}

module.exports = ($) => {
    const { proxy } = window.WarpJS;

    $(document).on('mousemove', '[data-warpjs-action="preview"][data-warpjs-preview-url]', throttle((evt) => {
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
                .then(() => proxy.get($, $(this).data('warpjsPreviewUrl')))
                .then((result) => Promise.resolve()
                    .then(() => {
                        // Tinymce dependent.
                        const chunks = (result.content || '').split('<br />');

                        const title = `<span class="close pull-right" data-dismiss="popover" aria-label="Close" aria-hidden="true">×</span>${result.title}`;
                        const content = chunks[0];

                        const popoverOptions = extend({}, BASE_POPOVER_OPTIONS, { title, content });

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
                    const popoverOptions = extend({}, BASE_POPOVER_OPTIONS, {
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
