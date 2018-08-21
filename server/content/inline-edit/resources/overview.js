// const debug = require('debug')('W2:content:inline-edit/resources/overview');
const Promise = require('bluebird');
const warpjsUtils = require('@warp-works/warpjs-utils');

module.exports = (persistence, relationship, instance) => Promise.resolve()
    .then(() => relationship ? relationship.getDocuments(persistence, instance) : [])
    .then((paragraphs) => paragraphs.map((paragraph) => warpjsUtils.createResource('', {
        type: paragraph.type,
        id: paragraph.id || paragraph._id,
        name: paragraph.Heading,
        description: paragraph.Content,
        position: paragraph.Position
    })))
    .then((paragraphs) => paragraphs.sort(warpjsUtils.byPositionThenName))
;
