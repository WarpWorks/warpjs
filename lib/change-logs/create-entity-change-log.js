const BaseChangeLog = require('./base-change-log');
const constants = require('./constants');
const extractUserFromReq = require('./extract-user-from-req');

class CreateEntityChangeLog extends BaseChangeLog {
}

CreateEntityChangeLog.action = constants.CREATE_ENTITY;

CreateEntityChangeLog.fromReq = (req, label, type, id) => {
    const user = extractUserFromReq(req);
    return new CreateEntityChangeLog(user, null, {label, type, id});
};

module.exports = CreateEntityChangeLog;
