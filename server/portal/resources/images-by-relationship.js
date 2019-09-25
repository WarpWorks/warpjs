const Promise = require('bluebird');

const imageResource = require('./image');

module.exports = async (persistence, relationship, instance, imageType) => {
    const images = relationship ? await relationship.getDocuments(persistence, instance) : [];
    return Promise.map(
        imageType ? images.filter((image) => image.Type === imageType) : images,
        async (image) => imageResource(persistence, relationship.getTargetEntity(), image)
    );
};
