const _ = require('lodash');
const Promise = require('bluebird');

const BaseChangeLog = require('./base-change-log');
const constants = require('./constants');
const extractUserFromReq = require('./extract-user-from-req');
const shorten = require('./shorten');

class AddEmbeddedChangeLog extends BaseChangeLog {
    toFormResource(domain, persistence, cache) {
        return Promise.resolve()
            .then(() => this.getBaseFormResource(domain, persistence, cache))
            .then((baseFormResource) => _.extend(baseFormResource, {
                action: 'Add new embedded',
                element: {
                    label: shorten(this.key, undefined, true), // TODO: Get the Entity name.
                    help: this.key
                }
            }))
        ;
    }

    static get action() {
        return constants.EMBEDDED_ADDED;
    }

    static fromReq(req, key, type, id) {
        const user = extractUserFromReq(req);
        return new AddEmbeddedChangeLog(user, key, {type, id});
    }
}

module.exports = AddEmbeddedChangeLog;
