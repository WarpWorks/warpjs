const Promise = require('bluebird');
const warpjsUtils = require('@warp-works/warpjs-utils');

const extractImagesByEntity = require('./images-by-paragraph');

module.exports = (persistence, relationship, instance) => Promise.resolve()
    .then(() => relationship.getDocuments(persistence, instance))
    .then((paragraphs) => paragraphs.sort(warpjsUtils.byPositionThenName))
    .then((paragraphs) => Promise.map(paragraphs, (paragraph) => Promise.resolve()
        .then(() => warpjsUtils.createResource('', {
            documentStyle: true,
            name: paragraph.Heading,
            description: paragraph.Content
        }))
        .then((paragraphResource) => Promise.resolve()
            .then(() => extractImagesByEntity(persistence, relationship.getTargetEntity(), paragraph))
            .then((images) => paragraphResource.embed('images', images))
            .then(() => paragraphResource)
        )
    ))
;
