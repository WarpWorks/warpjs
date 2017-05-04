const utils = require('./../../utils');
const HoverPreview = require('./utilities/image-map-hover.js');

const errorTemplate = require('./../../common/templates/_error.hbs');
const template = require("./../templates/index.hbs");

(($) => {
    $(document).ready(() => {
        utils.getCurrentPageHAL($)
            .then((result) => {
                let content;

                if (result.error) {
                    content = errorTemplate(result.data);
                } else {
                    console.log("initial load: data=", result.data);
                    content = template(result.data);
                }
                $('#i3c-portal-placeholder').html(content);

                const hoverPreview = new HoverPreview();

                $('.overview-image-container')
                .on('mouseenter', '.map-hover-area', hoverPreview.mouseEnter.bind(hoverPreview))
                .on('mouseleave', '.map-hover-area', hoverPreview.mouseLeave.bind(hoverPreview));
            });
    });
})(jQuery);
