const constants = require('./constants');
const debug = require('./debug')('generate-toc-numbers');

module.exports = (resource, parentVersion = '') => {
    debug(`resource=`, resource);
    if (resource && resource._embedded && resource._embedded.items && resource._embedded.items.length) {
        debug(`    items=`, resource._embedded.items);
        resource._embedded.items.reduce(
            (memo, item) => {
                if (item.type === constants.TYPES.PARAGRAPH) {
                    debug(`        item=`, item);
                    return memo;
                } else if (item.type === constants.TYPES.COMMUNITY) {
                    item.tocNumber = parentVersion ? `${parentVersion}.${memo}` : memo;
                    return memo + 1;
                }
            },
            1
        );
    }
};
