const _ = require('lodash');
const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const { routes } = require('./../constants');

class Orphan {
    constructor(reason, document) {
        this.reason = reason;
        this.document = _.cloneDeep(document);
    }

    get id() {
        return this.document.id;
    }

    toHAL(domainModel) {
        const href = RoutesInfo.expand(routes.instance, {
            domain: domainModel.name,
            type: this.document.type,
            id: this.document.id
        });

        const resource = warpjsUtils.createResource(href, {
            id: this.document.id,
            type: this.document.type,
            name: this.document.Name || this.document.name,
            label: domainModel.getDisplayName(this.document),
            reason: this.reason
        });

        return resource;
    }
}

Orphan.REASONS = Object.freeze({
    MISSING_ENTITY: "Document's entity is missing",
    MISSING_PARENT: "Parent document is missing",
    MISSING_RELATIONSHIP: "Parent document relationship is missing"
});

module.exports = Orphan;
