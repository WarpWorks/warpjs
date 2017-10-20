const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const isValidAction = require('./is-valid-action');
const WarpWorksError = require('./../core/error');

class BaseChangeLog {
    constructor(user, key, data, timestamp) {
        this.user = user;
        this.action = this.constructor.action;
        this.key = key;
        this.data = data;
        this.timestamp = timestamp || (new Date()).toISOString();

        if (!isValidAction(this.action)) {
            throw new WarpWorksError(`Unknown action '${this.action}'.`);
        }
    }

    toJSON() {
        return {
            timestamp: this.timestamp,
            user: this.user,
            action: this.action,
            key: this.key,
            data: this.data
        };
    }

    toFormResource(domain) {
        throw new Error(`Not implemented '${this.constructor.name}.toFormResource(domain)'.`);
    }

    getBaseFormResource(domain) {
        return {
            user: this.getUserResource(domain),
            timestamp: this.timestamp
        };
    }

    getUserResource(domain) {
        const url = RoutesInfo.expand('W2:content:instance', {
            domain,
            type: this.user.type,
            id: this.user.id
        });

        return warpjsUtils.createResource(url, {
            name: this.user.name,
            username: this.user.username
        });
    }
}

BaseChangeLog.fromDocument = (ChangeLogClass, changeLog) => new ChangeLogClass(changeLog.user, changeLog.key, changeLog.data, changeLog.timestamp);

module.exports = BaseChangeLog;
