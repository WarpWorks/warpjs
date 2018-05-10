const _ = require('lodash');
const Promise = require('bluebird');

const BaseChangeLog = require('./base-change-log');
const constants = require('./constants');
const extractUserFromReq = require('./extract-user-from-req');
const shorten = require('./shorten');

class RemoveEmbeddedChangeLog extends BaseChangeLog {
    toFormResource(domain) {
        return Promise.resolve()
            .then(() => this.getBaseFormResource(domain))
            .then((baseFormResource) => _.extend(baseFormResource, {
                action: 'Removed embedded',
                element: {
                    label: shorten(this.key, undefined, true), // TODO: Get the Entity name.
                    help: this.key
                }
            }))
        ;
    }

    static get action() {
        return constants.EMBEDDED_REMOVED;
    }

    static fromReq(req, key, type, id) {
        const user = extractUserFromReq(req);
        return new RemoveEmbeddedChangeLog(user, key);
    }
}

module.exports = RemoveEmbeddedChangeLog;
