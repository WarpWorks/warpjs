const _ = require('lodash');

module.exports = ($) => {
    const resizeImage = () => {
        $('.figure-container svg image').each((index, image) => {
            const container = $(image).closest('.figure-container');
            const containerWidth = container.width();
            const width = parseInt($(image).attr('width'), 10);
            const height = parseInt($(image).attr('height'), 10);
            const ratio = Math.round(height / width * 100) / 100;
            const containerHeight = Math.round(containerWidth * ratio);
            container.css('height', containerHeight + 'px');
        });
    };

    $(window).resize(_.debounce(resizeImage, 100));
    $(window).trigger('resize');
};
