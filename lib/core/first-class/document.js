const cloneDeep = require('lodash/cloneDeep');
const Promise = require('bluebird');

const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

// const debug = require('./debug')('document');
const routes = require('./../../constants/routes');
const DOCUMENT_STATUS = require('./document-status');

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

    static async computeDocumentStatus(persistence, entity, document) {
        const documentStatus = document[DOCUMENT_STATUS.PROPERTY] || DOCUMENT_STATUS.DEFAULT;

        const currentOrParentStatus = (documentStatus === DOCUMENT_STATUS.INHERITANCE)
            ? await this.computeParentDocumentStatus(persistence, entity, document)
            : documentStatus
        ;

        return currentOrParentStatus || documentStatus;
    }

    static async computeParentDocumentStatus(persistence, entity, document) {
        const parentDocuments = await entity.getParentInstance(persistence, document);
        const parentDocument = parentDocuments.pop();
        if (parentDocument) {
            const parentEntity = await entity.getParentEntity(document);
            return this.computeDocumentStatus(persistence, parentEntity, parentDocument);
        } else {
            return null;
        }
    }

    static async canEditDocument(persistence, entity, document, warpjsUser) {
        const serverUtils = require('./../../../server/utils');
        return serverUtils.canEdit(persistence, entity, document, warpjsUser);
    }

    static async isVisible(persistence, entity, document, warpjsUser) {
        const documentStatus = await this.computeDocumentStatus(persistence, entity, document);
        const documentIsPublic = DOCUMENT_STATUS.PUBLIC.indexOf(documentStatus) !== -1;
        if (documentIsPublic) {
            return documentIsPublic;
        }

        return this.canEditDocument(persistence, entity, document, warpjsUser);
    }

    static async getAuthors(persistence, entity, document) {
        const usersByRelationship = require('./../../../server/portal/resources/users-by-relationship');

        if (document.Author) {
            return document.Author;
        }

        const authorRelationship = entity.getRelationshipByName('Authors');
        if (authorRelationship) {
            const userResources = await usersByRelationship(persistence, authorRelationship, document);
            return userResources.map((userResource) => userResource.label).join(', ');
        }
    }

    async getPortalUrl(persistence) {
        const serverUtils = require('./../../../server/utils');

        const domain = await serverUtils.getDomain(this.domainName);
        const entity = domain.getEntityByInstance(this.document);

        return Document.getPortalUrl(persistence, entity, this.document);
    }

    static async getPortalUrl(persistence, entity, document) {
        const aliasRelationship = entity.getRelationshipByName('Alias');

        if (aliasRelationship) {
            const aliasDocuments = await aliasRelationship.getDocuments(persistence, document);
            if (aliasDocuments && aliasDocuments.length) {
                return `/${aliasDocuments[0].Name}`;
            }
        }

        return RoutesInfo.expand(routes.portal.entity, { type: document.type, id: document.id });
    }

    async bestDocument(persistence) {
        const serverUtils = require('./../../../server/utils');

        const domain = await serverUtils.getDomain(this.domainName);
        const entity = domain.getEntityByInstance(this.document);

        return Document.bestDocument(persistence, entity, this.document);
    }

    static async bestDocument(persistence, entity, document) {
        const domain = entity.getDomain();

        const predecessorRelationship = entity.getRelationshipByName('Predecessor');
        if (predecessorRelationship) {
            const predecessors = await recurseGatherRelationshipDocuments(persistence, document, predecessorRelationship, [ document ]);

            const successorRelationship = predecessorRelationship.getReverseRelationship();
            const predecessorsAndSuccessors = await recurseGatherRelationshipDocuments(persistence, document, successorRelationship, predecessors);

            await Promise.each(predecessorsAndSuccessors, async (doc) => {
                doc.Status = await Document.computeDocumentStatus(persistence, domain.getEntityByInstance(doc), doc);
            });

            if (predecessorsAndSuccessors && predecessorsAndSuccessors.length > 1) {
                predecessorsAndSuccessors.sort(warpjsUtils.byStatusThenVersion);
                // debug(`after sort: bestDocument(): ${document.type}/${document.id}:`, predecessorsAndSuccessors.map((i) => `${i.type}/${i.id}, ${i.Status}/${i.Version}`));
            }

            return predecessorsAndSuccessors[0];
        } else {
            return document;
        }
    }

    static async getDocument(persistence, type, id) {
        const serverUtils = require('./../../../server/utils');

        const entity = await serverUtils.getEntity(null, type);
        const document = await entity.getInstance(persistence, id);

        return new Document(entity.getDomain().name, document);
    }
}

Document.name = 'Document';

module.exports = Document;

const recurseGatherRelationshipDocuments = async (persistence, document, relationship, cumulator) => {
    const documents = await relationship.getDocuments(persistence, document);
    if (documents.length) {
        return Promise.reduce(
            documents,
            async (cumulator, relatedDocument) => {
                // debug(`recurseGatherRelationshipDocuments(): relatedDocument=${relatedDocument.type}/${relatedDocument.id}`);
                cumulator.push(relatedDocument);
                return recurseGatherRelationshipDocuments(persistence, relatedDocument, relationship, cumulator);
            },
            cumulator
        );
    } else {
        return cumulator;
    }
};
