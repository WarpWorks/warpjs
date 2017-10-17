const _ = require('lodash');

const BaseChangeLog = require('./base-change-log');
const constants = require('./constants');
const extractUserFromReq = require('./extract-user-from-req');
const shorten = require('./shorten');

class UpdateValueChangeLog extends BaseChangeLog {
    toFormResource(domain) {
        return _.extend(
            this.getBaseFormResource(domain),
            {
                action: 'Changed property',
                element: {
                    label: shorten(this.key, undefined, true), // TODO: Get the field name.
                    help: this.key
                },
                fromTo: {
                    fromValue: shorten(this.data.oldValue),
                    fromHelp: this.data.oldValue,
                    toValue: shorten(this.data.newValue),
                    toHelp: this.data.newValue
                }
            }
        );
    }
}

UpdateValueChangeLog.action = constants.UPDATE_VALUE;

UpdateValueChangeLog.fromReq = (req, key, oldValue, newValue) => {
    const user = extractUserFromReq(req);
    return new UpdateValueChangeLog(user, key, {oldValue, newValue});
};

module.exports = UpdateValueChangeLog;
