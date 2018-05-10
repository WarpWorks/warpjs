const Promise = require('bluebird');
const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const isValidAction = require('./is-valid-action');
const WarpWorksError = require('./../core/error');

const _cache = {};

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
        return Promise.resolve()
            .then(() => this.getUserResource(domain))
            .then((user) => ({
                user,
                timestamp: this.timestamp
            }))
        ;
    }

    getUserResource(domain) {
        if (this.user.id) {
            if (!_cache[this.user.id]) {
                const url = RoutesInfo.expand('W2:content:instance', {
                    domain,
                    type: this.user.type,
                    id: this.user.id
                });

                _cache[this.user.id] = warpjsUtils.createResource(url, {
                    name: this.user.name,
                    username: this.user.username
                });
            }
            return Promise.resolve()
                .then(() => _cache[this.user.id])
            ;
        } else {
            return Promise.resolve()
                .then(() => warpjsUtils.createResource('', {
                    name: this.user.name,
                    username: this.user.username
                }))
                .then((resource) => Promise.resolve()
                    .then(() => resource.link(
                        'thumbnail',
                        `${RoutesInfo.expand('W2:app:static')}/images/default-user.svg`
                    ))
                    .then(() => resource)
                )
            ;
        }
    }

    static fromDocument(ChangeLogClass, changeLog) {
        return new ChangeLogClass(changeLog.user, changeLog.key, changeLog.data, changeLog.timestamp);
    }
}

module.exports = BaseChangeLog;
