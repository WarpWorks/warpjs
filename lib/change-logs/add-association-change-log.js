const _ = require('lodash');
const Promise = require('bluebird');

const BaseChangeLog = require('./base-change-log');
const constants = require('./constants');
const extractUserFromReq = require('./extract-user-from-req');

class AddAssociationChangeLog extends BaseChangeLog {
    toFormResource(domain, persistence, cache, routes) {
        return Promise.resolve()
            .then(() => this.getBaseFormResource(domain, persistence, cache))
            .then((baseFormResource) => _.extend(baseFormResource, {
                action: 'Added association',
                element: {
                    label: this.key,
                    help: this.key
                },
                value: {
                    label: this.data.label,
                    href: this.href(routes, domain, this.data.type, this.data.id)
                }
            }))
        ;
    }

    static get action() {
        return constants.ASSOCIATION_ADDED;
    }

    static fromReq(req, key, label, type, id) {
        const user = extractUserFromReq(req);
        return new AddAssociationChangeLog(user, key, {label, type, id});
    }
}

module.exports = AddAssociationChangeLog;
