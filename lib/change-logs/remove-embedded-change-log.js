const _ = require('lodash');

const BaseChangeLog = require('./base-change-log');
const constants = require('./constants');
const extractUserFromReq = require('./extract-user-from-req');
const shorten = require('./shorten');

class RemoveEmbeddedChangeLog extends BaseChangeLog {
    toFormResource(domain) {
        return _.extend(
            this.getBaseFormResource(domain),
            {
                action: 'Removed embedded',
                element: {
                    label: shorten(this.key, undefined, true), // TODO: Get the Entity name.
                    help: this.key
                }
            }
        );
    }
}

RemoveEmbeddedChangeLog.action = constants.EMBEDDED_REMOVED;

RemoveEmbeddedChangeLog.fromReq = (req, key, type, id) => {
    const user = extractUserFromReq(req);
    return new RemoveEmbeddedChangeLog(user, key);
};

module.exports = RemoveEmbeddedChangeLog;
