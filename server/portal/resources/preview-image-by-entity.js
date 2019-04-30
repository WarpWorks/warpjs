// const debug = require('./debug')('preview-image-by-entity');
const imageTypes = require('./../../../lib/core/image-types');
const imagesByRelationship = require('./images-by-relationship');
const overviewByEntity = require('./overview-by-entity');

module.exports = async (persistence, entity, instance) => {
    const relationship = entity ? entity.getRelationshipByName('Images') : null;
    const images = relationship ? await imagesByRelationship(persistence, relationship, instance, imageTypes.PREVIEW_IMAGE) : null;
    const image = images && images.length ? images[0] : null;

    if (image) {
        return image._links.self.href;
    }

    const overview = await overviewByEntity(persistence, entity, instance);
    const paragraphs = overview && overview._embedded ? overview._embedded.items : null;
    const paragraph = paragraphs && paragraphs.length ? paragraphs[0] : null;
    const paragraphImages = paragraph && paragraph._embedded ? paragraph._embedded.images : null;
    const paragraphImage = paragraphImages && paragraphImages.length ? paragraphImages[0] : null;
    const link = paragraphImage && paragraphImage._links ? paragraphImage._links.self : null;
    return link ? link.href : null;
};
