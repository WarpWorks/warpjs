const _ = require('lodash');
const Promise = require('bluebird');

const BaseChangeLog = require('./base-change-log');
const constants = require('./constants');
const extractUserFromReq = require('./extract-user-from-req');

class CreateEntityChangeLog extends BaseChangeLog {
    toFormResource(domain, persistence, cache, routes) {
        return Promise.resolve()
            .then(() => this.getBaseFormResource(domain, persistence, cache))
            .then((baseFormResource) => _.extend(baseFormResource, {
                action: 'Created',
                from: {
                    label: this.data.label,
                    href: this.href(routes, domain, this.data.type, this.data.id)
                }
            }))
        ;
    }

    static get action() {
        return constants.CREATE_ENTITY;
    }

    static fromReq(req, label, type, id) {
        const user = extractUserFromReq(req);
        return new CreateEntityChangeLog(user, null, {label, type, id});
    }
}

module.exports = CreateEntityChangeLog;
