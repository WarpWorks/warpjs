const Promise = require('bluebird');

const imageResource = require('./image');

module.exports = (persistence, relationship, instance, imageType) => Promise.resolve()
    .then(() => relationship ? relationship.getDocuments(persistence, instance) : [])
    .then((images) => {
        if (imageType) {
            return images.filter((image) => image.Type === imageType);
        } else {
            return images;
        }
    })
    .then((images) => Promise.map(
        images,
        (image) => imageResource(persistence, relationship.getTargetEntity(), image)
    ))
;
