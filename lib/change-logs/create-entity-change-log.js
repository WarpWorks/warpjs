const _ = require('lodash');
const Promise = require('bluebird');
const RoutesInfo = require('@quoin/expressjs-routes-info');

const BaseChangeLog = require('./base-change-log');
const constants = require('./constants');
const extractUserFromReq = require('./extract-user-from-req');

class CreateEntityChangeLog extends BaseChangeLog {
    toFormResource(domain, persistence, cache) {
        return Promise.resolve()
            .then(() => this.getBaseFormResource(domain, persistence, cache))
            .then((baseFormResource) => _.extend(baseFormResource, {
                action: 'Created',
                from: {
                    label: this.data.label,
                    href: RoutesInfo.expand('W2:content:instance', {
                        domain,
                        type: this.data.type,
                        id: this.data.id
                    })
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
