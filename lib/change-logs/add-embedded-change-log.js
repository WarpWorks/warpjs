const _ = require('lodash');

const BaseChangeLog = require('./base-change-log');
const constants = require('./constants');
const extractUserFromReq = require('./extract-user-from-req');
const shorten = require('./shorten');

class AddEmbeddedChangeLog extends BaseChangeLog {
    toFormResource(domain) {
        return _.extend(
            this.getBaseFormResource(),
            {
                action: 'Add new embedded',
                element: {
                    label: shorten(this.key, undefined, true), // TODO: Get the Entity name.
                    help: this.key
                }
            }
        );
    }
}

AddEmbeddedChangeLog.action = constants.EMBEDDED_ADDED;

AddEmbeddedChangeLog.fromReq = (req, key, type, id) => {
    const user = extractUserFromReq(req);
    return new AddEmbeddedChangeLog(user, key, {type, id});
};

module.exports = AddEmbeddedChangeLog;
