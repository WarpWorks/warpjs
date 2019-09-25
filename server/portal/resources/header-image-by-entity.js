const warpjsUtils = require('@warp-works/warpjs-utils');

const imagesByRelationship = require('./images-by-relationship');
const imageTypes = require('./../../../lib/core/image-types');

// const debug = require('./debug')('header-image-by-entity');

const DEFAULT_TESTBED_HEADER_IMAGE = '/public/default-header-image-testbed.png';

module.exports = async (persistence, entity, instance) => {
    const relationship = entity.getRelationshipByName('Images');
    const images = relationship ? await imagesByRelationship(persistence, relationship, instance, imageTypes.HEADER_IMAGE) : null;
    const image = images && images.length ? images[0] : null;

    if (!image && entity.name === 'Testbed') {
        return warpjsUtils.createResource(DEFAULT_TESTBED_HEADER_IMAGE, {
            type: 'Image',
            imageType: 'HeaderImage'
        });
    } else {
        return image;
    }
};
