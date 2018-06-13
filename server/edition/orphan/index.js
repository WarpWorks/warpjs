const _ = require('lodash');
const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const REASONS = require('./reasons');

class Orphan {
    constructor(reason, document, details) {
        this.reason = reason;
        this.document = _.cloneDeep(document);
        this.details = details;
    }

    get id() {
        return this.document.id;
    }

    static get REASONS() {
        return REASONS;
    }

    toHAL(domainModel, routes) {
        const href = RoutesInfo.expand(routes.instance, {
            domain: domainModel.name,
            type: this.document.type,
            id: this.document.persistenceId || this.document.id
        });

        const resource = warpjsUtils.createResource(href, {
            id: this.document.id,
            type: this.document.type,
            name: this.document.Name || this.document.name,
            label: domainModel.getDisplayName(this.document),
            reason: this.reason,
            details: this.details
        });

        return resource;
    }
}

module.exports = Orphan;
