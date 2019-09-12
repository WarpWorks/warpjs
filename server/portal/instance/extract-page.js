const indexOf = require('lodash/indexOf');
const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const { DEFAULT_VERSION } = require('./../../../lib/constants');
const Document = require('./../../../lib/core/first-class/document');
const breadcrumbsByEntity = require('./../resources/breadcrumbs-by-entity');
const contentConstants = require('./../../content/constants');
// const debug = require('./debug')('extract-page');
const extractPageView = require('./extract-page-view');
const headerImageByEntity = require('./../resources/header-image-by-entity');
const routes = require('./../../../lib/constants/routes');
const serverUtils = require('./../../utils');
const targetPreviewsByEntity = require('./../resources/target-previews-by-entity');

const config = serverUtils.getConfig();
const statusConfig = config.status;

module.exports = async (req, persistence, entity, instance, pageViewName) => {
    const resource = warpjsUtils.createResource(req, {
        id: instance.id,
        typeId: entity.id,
        typeName: entity.name,
        typeLabel: entity.label || entity.name,
        name: entity.getDisplayName(instance),
        isHomePage: entity.name === config.domainName,
        hasGA: config.analytics && config.analytics.apiKey,
        version: instance.Version || DEFAULT_VERSION, // FIXME: Use BasicProperty.
        description: instance.Description,
        keywords: instance.Keywords,
        author: instance.Author,
        releaseableContent: instance.ReleaseableContent,
        versionable: instance.Versionable
    });

    // Because of aliases, let's use the URL with the id.
    if (resource._links && resource._links.self) {
        resource._links.self.href = RoutesInfo.expand(routes.portal.entity, {
            type: instance.type,
            id: instance.id
        });
    }

    if (resource.releaseableContent) {
        resource.link('pdfExport', {
            href: RoutesInfo.expand(routes.portal.entityPdf, instance),
            title: "Get the document in PDF"
        });
    }

    // Breadcrumb
    const breadcrumbs = await breadcrumbsByEntity(persistence, entity, instance);
    resource.embed('breadcrumbs', breadcrumbs);

    const canEdit = await serverUtils.canEdit(persistence, entity, instance, req.warpjsUser);

    // WriteAccess
    if (canEdit) {
        resource.link('edit', {
            href: RoutesInfo.expand(contentConstants.routes.instance, {
                domain: config.domainName,
                type: instance.type,
                id: instance.id
            }),
            title: `Edit "${resource.name}"`
        });

        resource.link('inlineEdit', {
            href: RoutesInfo.expand(contentConstants.routes.inlineEdit, {
                domain: config.domainName,
                type: instance.type,
                id: instance.id,
                view: pageViewName
            }),
            title: `In-line edit "${resource.name}"`
        });

        resource.link('alias', {
            href: RoutesInfo.expand(routes.portal.alias, {
                type: instance.type,
                id: instance.id
            }),
            title: 'Aliases'
        });
    }

    // Document status
    const documentStatus = await Document.computeDocumentStatus(persistence, entity, instance);
    resource.status = {
        documentStatus,
        isPublic: (indexOf(statusConfig.public, documentStatus) !== -1),
        showDisclaimer: (indexOf(statusConfig.disclaimer, documentStatus) !== -1)
    };
    resource.status.isVisible = Boolean(req.warpjsUser);

    // Page content
    if (resource.status.isVisible) {
        const headerImages = await headerImageByEntity(persistence, entity, instance);
        resource.embed('headerImages', headerImages);

        const targetPreviews = await targetPreviewsByEntity(persistence, entity, instance);
        resource.embed('previews', targetPreviews);

        const pageView = await entity.getPageView(pageViewName, config.views.portal);
        const pageViewResource = await extractPageView(persistence, pageView, instance, req.query.style);
        resource.embed('pageViews', pageViewResource);
    }

    // Versions
    const predecessorRelationship = entity.getRelationshipByName('Predecessor');
    if (predecessorRelationship) {
        await predecessorOrSuccessorLink(persistence, instance, resource, predecessorRelationship, 'versionPredecessor');
        await predecessorOrSuccessorLink(persistence, instance, resource, predecessorRelationship, 'firstVersionPredecessor', true);

        const successorRelationship = predecessorRelationship.getReverseRelationship();
        await predecessorOrSuccessorLink(persistence, instance, resource, successorRelationship, 'versionSuccessor');
        await predecessorOrSuccessorLink(persistence, instance, resource, successorRelationship, 'lastVersionSuccessor', true);
    }

    // Aliases
    const aliasRelationship = entity.getRelationshipByName('Alias');
    if (aliasRelationship) {
        const aliasDocuments = await aliasRelationship.getDocuments(persistence, instance);
        if (aliasDocuments && aliasDocuments.length) {
            resource.embed('aliases', aliasDocuments.map((aliasDocument) => warpjsUtils.createResource('', {
                name: aliasDocument.Name,
                view: aliasDocument.View
            })));
        }
    }

    return resource;
};

const predecessorOrSuccessorLink = async (persistence, instance, resource, relationship, linkName, recursive) => {
    if (relationship) {
        const documents = await relationship.getDocuments(persistence, instance);
        if (documents && documents.length) {
            let foundRecursion = false;

            if (recursive) {
                // We need to check if the same relationship can be applied
                // again.
                const nextGenerationDocuments = await relationship.getDocuments(persistence, documents[0]);
                if (nextGenerationDocuments && nextGenerationDocuments.length) {
                    await predecessorOrSuccessorLink(persistence, documents[0], resource, relationship, linkName, recursive);
                    foundRecursion = true;
                }
            }

            if (!foundRecursion) {
                const href = RoutesInfo.expand('entity', {
                    type: documents[0].type,
                    id: documents[0].id
                });

                resource.link(linkName, {
                    href,
                    title: documents[0].Version || DEFAULT_VERSION
                });
            }
        }
    }
};
