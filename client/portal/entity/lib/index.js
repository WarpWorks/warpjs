const warpjsUtils = require('@warp-works/warpjs-utils');

const HoverPreview = require('./utilities/image-map-hover');

const template = require("./../templates/index.hbs");

const errorTemplate = warpjsUtils.requirePartial('error-portal');

(($) => {
    $(document).ready(() => {
        warpjsUtils.getCurrentPageHAL($)
            .then((result) => {
                const content = (result.error) ? errorTemplate(result.data) : template(result.data);
                if (!result.error && result.data && result.data.Name) {
                    document.title = result.data.Name;
                }

                $('#warpjs-content-placeholder').html(content);

                const hoverPreview = new HoverPreview();

                $('.overview-image-container')
                    .on('mouseenter', '.map-hover-area', hoverPreview.onFocus.bind(hoverPreview, $))
                    .on('mouseleave', '.map-hover-area', hoverPreview.onBlur.bind(hoverPreview, $));

                let delta = 500;
                $('.overview-image-container .map-hover-area[data-target-href]').each((index, element) => {
                    delta += 2000;
                    setTimeout(() => hoverPreview.cacheHref($, $(element).data('targetHref')), delta);
                });
            });
    });
})(jQuery);
