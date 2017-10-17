const _ = require('lodash');
const RoutesInfo = require('@quoin/expressjs-routes-info');

const BaseChangeLog = require('./base-change-log');
const constants = require('./constants');
const extractUserFromReq = require('./extract-user-from-req');

class AddAssociationChangeLog extends BaseChangeLog {
    toFormResource(domain) {
        return _.extend(
            this.getBaseFormResource(domain),
            {
                action: 'Added association',
                element: {
                    label: this.key,
                    help: this.key
                },
                value: {
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

AddAssociationChangeLog.action = constants.ASSOCIATION_ADDED;

AddAssociationChangeLog.fromReq = (req, key, label, type, id) => {
    const user = extractUserFromReq(req);
    return new AddAssociationChangeLog(user, key, {label, type, id});
};

module.exports = AddAssociationChangeLog;
