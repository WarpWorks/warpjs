const _ = require('lodash');
const Promise = require('bluebird');
const RoutesInfo = require('@quoin/expressjs-routes-info');

const BaseChangeLog = require('./base-change-log');
const constants = require('./constants');
const extractUserFromReq = require('./extract-user-from-req');

class AddAggregationChangeLog extends BaseChangeLog {
    toFormResource(domain) {
        return Promise.resolve()
            .then(() => this.getBaseFormResource(domain))
            .then((baseFormResource) => _.extend(baseFormResource, {
                action: 'Created child',
                element: {
                    label: this.key,
                    help: this.key
                },
                value: {
                    label: "NEW",
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
        return constants.AGGREGATION_ADDED;
    }

    static fromReq(req, key, type, id) {
        const user = extractUserFromReq(req);
        return new AddAggregationChangeLog(user, key, {type, id});
    }
}

module.exports = AddAggregationChangeLog;
