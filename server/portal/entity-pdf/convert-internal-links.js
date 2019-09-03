const Promise = require('bluebird');

const CONTENT_LINK_RE = require('./../../../lib/core/content-link-re');
const { CONVERTED_CUSTOM_LINK } = require('./constants');
// const debug = require('./debug')('convert-internal-links');
const Document = require('./../../../lib/core/first-class/document');
const { matchAll } = require('./../../../lib/core/utils');

module.exports = async (persistence, domain, content) => {
    const matches = matchAll(content, CONTENT_LINK_RE);
    if (matches && matches.length) {
        return Promise.reduce(
            matches,
            async (content, match) => {
                const [ matchString, label, type, id ] = match;

                const entity = domain.getEntityByName(type);
                const document = await entity.getInstance(persistence, id);
                const bestDocument = await Document.bestDocument(persistence, domain.getEntityByInstance(document), document);
                const bestDocumentUrl = await Document.getPortalUrl(persistence, domain.getEntityByInstance(bestDocument), bestDocument);
                return content.replace(matchString, `{{${label},${CONVERTED_CUSTOM_LINK},${bestDocumentUrl}}}`);
            },
            content
        );
    }

    return content;
};
