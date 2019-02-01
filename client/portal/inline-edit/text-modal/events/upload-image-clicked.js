const comingSoon = require('./../../coming-soon');

module.exports = ($, modal) => {
    modal.on('click', '.image-carousel-container .warpjs-inline-edit-image-upload-button', (event) => {
        comingSoon($, "Uploading a new image");
    });
};
