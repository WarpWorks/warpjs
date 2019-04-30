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

    toBasicResource() {
        const href = RoutesInfo.expand(routes.portal.entity, {
            type: this.document.type,
            id: this.document.id
        });

        const resource = warpjsUtils.createResource(href, {
            type: this.document.type,
            typeID: this.document.typeID,
            id: this.document.id,
            name: this.document.Name,
            lastUpdated: this.document.lastUpdated
        });

        resource._links.self.title = resource.name;

        resource.link('follow', {
            title: "Follow document",
            href: RoutesInfo.expand(routes.portal.follow, {
                type: this.document.type,
                id: this.document.id,
                yesno: 'yes'
            })
        });

        resource.link('unfollow', {
            title: "Follow document",
            href: RoutesInfo.expand(routes.portal.follow, {
                type: this.document.type,
                id: this.document.id,
                yesno: 'no'
            })
        });

        return resource;
    }

    toDocumentListResource() {
        // debug(`toDocumentListResource(): this.document=`, this.document);
        const resource = this.toBasicResource();

        resource.relnType = cloneDeep(this.document.relnType);
        resource.notify = false; // FIXME

        return resource;
    }

    toNotificationListResource() {
        const resource = this.toBasicResource();

        return resource;
    };
}

Document.name = 'Document';

module.exports = Document;
