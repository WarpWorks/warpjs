const cloneDeep = require('lodash/cloneDeep');

const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

// const debug = require('./debug')('document');
const routes = require('./../../constants/routes');

class Document {
    constructor(domainName, contentDocument) {
        this.domainName = domainName;
        this.document = cloneDeep(contentDocument || {});
    }

    toDocumentListResource() {
        // debug(`toDocumentListResource(): this.document=`, this.document);
        const href = RoutesInfo.expand(routes.portal.entity, {
            type: this.document.type,
            id: this.document.id
        });

        const resource = warpjsUtils.createResource(href, {
            type: this.document.type,
            typeID: this.document.typeID,
            id: this.document.id,
            name: this.document.Name,
            lastUpdated: this.document.lastUpdated,
            relnType: cloneDeep(this.document.relnType),

            notify: false // FIXME
        });

        return resource;
    }
}

Document.name = 'Document';

module.exports = Document;
