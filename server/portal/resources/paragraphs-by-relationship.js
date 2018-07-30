const Promise = require('bluebird');
const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const CONTENT_LINK_RE = require('./../../../lib/core/content-link-re');
const imagesByParagraph = require('./images-by-paragraph');

function contentLinkReplacer(match, label, type, id) {
    const href = RoutesInfo.expand('entity', { type, id });
    const previewUrl = RoutesInfo.expand('W2:portal:preview', { type, id });
    return `<a href="${href}" data-warpjs-action="preview" data-warpjs-preview-url="${previewUrl}">${label}<span class="glyphicon glyphicon-link"></span></a>`;
}

function convertCustomLinks(text) {
    return (text || '').replace(CONTENT_LINK_RE, contentLinkReplacer);
}

module.exports = (persistence, relationship, instance) => Promise.resolve()
    .then(() => relationship.getDocuments(persistence, instance))
    .then((paragraphs) => paragraphs.sort(warpjsUtils.byPositionThenName))
    .then((paragraphs) => Promise.map(paragraphs, (paragraph) => Promise.resolve()
        .then(() => warpjsUtils.createResource('', {
            showItem: true,
            documentStyle: true,
            name: paragraph.Heading,
            description: convertCustomLinks(paragraph.Content)
        }))
        .then((paragraphResource) => Promise.resolve()
            .then(() => imagesByParagraph(persistence, relationship.getTargetEntity(), paragraph))
            .then((images) => paragraphResource.embed('images', images))
            .then(() => paragraphResource)
        )
    ))
;
