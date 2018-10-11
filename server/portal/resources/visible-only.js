// const debug = require('debug')('W2:portal:resources/visible-only');

module.exports = (doc) => {
    if (doc.Name === 'TEMPLATE') {
        // That's the special document.
        return false;
    } else if (doc.Status === 'Draft' || doc.Status === 'Retired' || doc.Status === 'Declined') {
        // FIXME: Hard-coded.
        // We don't want to show these.
        // debug(`Ignoring Status=${doc.Status}`);
        return false;
    } else if (doc.Status === 'InheritFromParent') {
        // TODO: Check parent.
        // debug(`*** Need to check parent ***`);
        return true;
    } else {
        // debug(`Should be ok? Status=${doc.Status}`);
        return true;
    }
};
