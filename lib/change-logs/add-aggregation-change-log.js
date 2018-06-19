const _ = require('lodash');
const Promise = require('bluebird');
const BaseChangeLog = require('./base-change-log');
const constants = require('./constants');
const extractUserFromReq = require('./extract-user-from-req');

class AddAggregationChangeLog extends BaseChangeLog {
    toFormResource(domain, persistence, cache, routes) {
        return Promise.resolve()
            .then(() => this.getBaseFormResource(domain, persistence, cache))
            .then((baseFormResource) => _.extend(baseFormResource, {
                action: 'Created child',
                element: {
                    label: this.key,
                    help: this.key
                },
                value: {
                    label: "NEW",
                    href: this.href(routes, domain, this.data.type, this.data.id)
                }
            }))
        ;
    }

    static get action() {
        return constants.AGGREGATION_ADDED;
    }

    static fromReq(req, key, type, id) {
        const user = extractUserFromReq(req);
        return new AddAggregationChangeLog(user, key, {type, id});
    }
}

module.exports = AddAggregationChangeLog;
