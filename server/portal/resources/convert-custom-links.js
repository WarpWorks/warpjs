const RoutesInfo = require('@quoin/expressjs-routes-info');

const CONTENT_LINK_RE = require('./../../../lib/core/content-link-re');

function contentLinkReplacer(match, label, type, id) {
    const href = RoutesInfo.expand('entity', { type, id });
    const previewUrl = RoutesInfo.expand('W2:portal:preview', { type, id });
    return `<a href="${href}" data-warpjs-action="preview" data-warpjs-preview-url="${previewUrl}">${label}<span class="glyphicon glyphicon-link"></span></a>`;
}

module.exports = (text) => (text || '').replace(CONTENT_LINK_RE, contentLinkReplacer);
