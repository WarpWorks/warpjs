const _ = require('lodash');
const RoutesInfo = require('@quoin/expressjs-routes-info');

const BaseChangeLog = require('./base-change-log');
const constants = require('./constants');
const extractUserFromReq = require('./extract-user-from-req');

class CreateEntityChangeLog extends BaseChangeLog {
    toFormResource(domain) {
        return _.extend(
            this.getBaseFormResource(domain),
            {
                action: 'Created',
                from: {
                    label: this.data.label,
                    href: RoutesInfo.expand('W2:content:instance', {
                        domain,
                        type: this.data.type,
                        id: this.data.id
                    })
                }
            }
        );
    }
}

CreateEntityChangeLog.action = constants.CREATE_ENTITY;

CreateEntityChangeLog.fromReq = (req, label, type, id) => {
    const user = extractUserFromReq(req);
    return new CreateEntityChangeLog(user, null, {label, type, id});
};

module.exports = CreateEntityChangeLog;
