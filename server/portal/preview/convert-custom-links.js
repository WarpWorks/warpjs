const CONTENT_LINK_RE = require('./../../../lib/core/content-link-re');
const contentLinkReplacer = require('./content-link-replacer');

module.exports = async (persistence, domain, text) => {
    return (text || '').replace(CONTENT_LINK_RE, contentLinkReplacer);
};
