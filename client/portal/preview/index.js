const _ = require('lodash');
const warpjsUtils = require('@warp-works/warpjs-utils');

const centerOfImageArea = require('./center-of-image-area');
const position = require('./position');

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

            // $(this).data('toggle', 'popover');

            const centerCoords = centerOfImageArea($, this);
            if (centerCoords) {
                // This depends on the DOM.
                const imageOffset = $(this).closest('figure').children('img').offset();

                popoverOffset = {
                    left: centerCoords.x + Math.floor(imageOffset.left),
                    top: centerCoords.y + Math.floor(imageOffset.top) - 15
                };
                $(this).popover(popoverOptions);
            } else {
                $(this).popover(_.extend({}, popoverOptions, {placement: 'auto'}));
            }

            $(this).popover('show');

            const popover = $('.popover.in');

            warpjsUtils.proxy.get($, $(this).data('warpjsPreviewUrl'))
                .then((result) => position($, this, popover, result, popoverOffset))
                .then(() => {
                    $('[data-dismiss="popover"]', popover).on('click', () => popover.popover('hide'));
                })
                .catch(() => {
                    $('.popover-title', popover).html("Trouble loading preview");
                    $('.popover-content', popover).html(`<div class="alert alert-danger">Issue loading preview page</div>`);
                })
            ;
        })
    ;
};
