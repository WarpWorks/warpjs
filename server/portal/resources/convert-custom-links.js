const Promise = require('bluebird');

const RoutesInfo = require('@quoin/expressjs-routes-info');

const CONTENT_LINK_RE = require('./../../../lib/core/content-link-re');
const Document = require('./../../../lib/core/first-class/document');
const { matchAll } = require('./../../../lib/core/utils');
const routes = require('./../../../lib/constants/routes');
const serverUtils = require('./../../utils');

// const debug = require('./debug')('convert-custom-links');

module.exports = async (persistence, domain, content) => {
    // debug(`entering... content=`, content);

    content = content || '';
    const matches = matchAll(content, CONTENT_LINK_RE);
    if (matches && matches.length) {
        // debug(`    matches=`, matches);
        return Promise.reduce(
            matches,
            async (cumulator, match) => {
                const str = match[0];
                const label = match[1];
                const type = match[2];
                const id = match[3];

                const document = await Document.getDocument(persistence, type, id);
                const bestDocument = await document.bestDocument(persistence);

                const previewUrl = RoutesInfo.expand(routes.portal.preview, { type: bestDocument.type, id: bestDocument.id });

                const entity = await serverUtils.getEntity(null, type);

                const href = await Document.getPortalUrl(persistence, entity, bestDocument);

                const aTag = `<a href="${href}" data-warpjs-action="preview" data-warpjs-preview-url="${previewUrl}">${label}<span class="glyphicon glyphicon-link"></span></a>`;
                // debug(`        need to replace '${str}' with ${aTag}`);
                return cumulator.replace(str, aTag);
            },
            content
        );
    } else {
        return content;
    }
};
