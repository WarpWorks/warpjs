const _ = require('lodash');
const Promise = require('bluebird');

const BaseChangeLog = require('./base-change-log');
const constants = require('./constants');
const extractUserFromReq = require('./extract-user-from-req');
const shorten = require('./shorten');

class UpdateValueChangeLog extends BaseChangeLog {
    toFormResource(domain, persistence, cache) {
        return Promise.resolve()
            .then(() => this.getBaseFormResource(domain, persistence, cache))
            .then((baseFormResource) => _.extend(baseFormResource, {
                action: 'Changed property',
                element: {
                    label: shorten(this.key, undefined, true), // TODO: Get the field name.
                    help: this.key
                },
                fromTo: {
                    fromValue: shorten(this.data.oldValue),
                    fromHelp: this.data.oldValue,
                    fromClass: (this.key === 'Enum:Status') ? `warpjs-document-status warpjs-document-status-${this.data.oldValue}` : '',
                    toValue: shorten(this.data.newValue),
                    toHelp: this.data.newValue,
                    toClass: (this.key === 'Enum:Status') ? `warpjs-document-status warpjs-document-status-${this.data.newValue}` : ''
                },
                isEnumeration: this.key.substr(0, 5) === 'Enum:'
            }))
        ;
    }

    static get action() {
        return constants.UPDATE_VALUE;
    }

    static fromReq(req, key, oldValue, newValue) {
        const user = extractUserFromReq(req);
        return new UpdateValueChangeLog(user, key, {oldValue, newValue});
    }
}

module.exports = UpdateValueChangeLog;
