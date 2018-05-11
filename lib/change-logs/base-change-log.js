// const debug = require('debug')('W2:lib/change-logs/base-change-log');
const Promise = require('bluebird');
const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const isValidAction = require('./is-valid-action');
const profileImage = require('./../user-profile/image');
const warpCore = require('./../core');
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

    toFormResource(domain, persistence, cache) {
        throw new Error(`Not implemented '${this.constructor.name}.toFormResource(domain, persistence, cache)'.`);
    }

    getBaseFormResource(domain, persistence, cache) {
        return Promise.resolve()
            .then(() => this.getUserResource(domain, persistence, cache))
            .then((user) => ({
                user,
                timestamp: this.timestamp
            }))
        ;
    }

    getUserResource(domain, persistence, cache) {
        if (this.user.id) {
            return Promise.resolve()
                .then(() => {
                    if (!cache[this.user.id]) {
                        return Promise.resolve()
                            .then(() => RoutesInfo.expand('W2:content:instance', {
                                domain,
                                type: this.user.type,
                                id: this.user.id
                            }))
                            .then((url) => warpjsUtils.createResource(url, {
                                name: this.user.name,
                                username: this.user.username
                            }))
                            .then((resource) => {
                                cache[this.user.id] = resource;
                            })
                            .then(() => warpCore.getDomainByName(domain))
                            .then((domainEntity) => domainEntity.getEntityByName('User')) // FIXME: Hard-coded
                            .then((userEntity) => Promise.resolve()
                                .then(() => userEntity.getDocuments(persistence, {_id: this.user.id}, true))
                                .then((documents) => {
                                    if (documents && documents.length) {
                                        return documents[0];
                                    } else {
                                        return null;
                                    }
                                })
                                .then((userInstance) => {
                                    if (userInstance) {
                                        return profileImage(persistence, userEntity, userInstance);
                                    } else {
                                        return null;
                                    }
                                })
                                .then((imageUrl) => imageUrl || `${RoutesInfo.expand('W2:app:static')}/images/default-user.svg`)
                                .then((imageUrl) => cache[this.user.id].link('thumbnail', imageUrl))
                            )
                        ;
                    }
                })
                .then(() => cache[this.user.id])
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
