const _ = require('lodash');
const Promise = require('bluebird');
const warpjsUtils = require('@warp-works/warpjs-utils');

const BASE_POPOVER_OPTIONS = Object.freeze({
    html: true,
    placement: 'top',
    trigger: 'hover focus'
});
const INITIALIZED = 'warpjsPopoverInitialized';
const CSS = Object.freeze({
    maxHeight: '110px',
    overflow: 'hidden'
});

function position(popover, evt) {
    popover.offset({
        left: Math.max(0, evt.clientX - (popover.width() / 2)),
        top: Math.max(0, evt.clientY - popover.height())
    });
}

function findPopover($) {
    const popover = $('.popover.in');
    $('.popover-content', popover).css(CSS);
    return popover;
}

module.exports = ($) => {
    $('[data-warpjs-action="preview"][data-warpjs-preview-url]')
        .on('mouseenter', function(evt) {
            if ($(this).data(INITIALIZED)) {
                $(this).popover('show');

                const popover = findPopover($);
                position(popover, evt);
            } else {
                Promise.resolve()
                    .then(() => warpjsUtils.proxy.get($, $(this).data('warpjsPreviewUrl')))
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
        })
    ;
};
