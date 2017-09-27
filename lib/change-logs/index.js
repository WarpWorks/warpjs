const _ = require('lodash');

const constants = require('./constants');
const WarpWorksError = require('./../core/error');

class ChangeLogs {
    constructor(instance) {
        this.instance = instance;

        if (!this.instance._meta) {
            this.instance._meta = {};
        }

        if (!this.instance._meta.history) {
            this.instance._meta.history = [];
        }
    }

    addLogFromReq(req, action, key, oldValue, newValue) {
        const user = {
            id: req.warpjsUser._id,
            type: req.warpjsUser.type,
            name: req.warpjsUser.Name,
            username: req.warpjsUser.UserName
        };

        return this.addLog(user, action, key, oldValue, newValue);
    }

    addLog(user, action, key, oldValue, newValue) {
        if (!this.constructor.isValidAction(action)) {
            throw new WarpWorksError(`Unknown action '${action}'.`);
        }

        const data = {
            user,
            action,
            key,
            oldValue,
            newValue
        };

        this.instance._meta.history.push(data);
        return this.instance;
    }

    toJSON() {
        return _.cloneDeep(this.instance._meta.history);
    }
}

ChangeLogs.constants = constants;

ChangeLogs.addLogFromReq = (req, instance, action, key, oldValue, newValue) => {
    return (new ChangeLogs(instance)).addLogFromReq(req, action, key, oldValue, newValue);
};

ChangeLogs.isValidAction = (action) => (_.values(constants).indexOf(action) !== -1);

module.exports = ChangeLogs;
