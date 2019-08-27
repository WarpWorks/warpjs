const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

// const debug = require('./debug')('preview-by-entity');
const Document = require('./../../../lib/core/first-class/document');
const overviewByEntity = require('./overview-by-entity');
const previewImageByEntity = require('./preview-image-by-entity');
const routes = require('./../../../lib/constants/routes');

module.exports = async (persistence, entity, instance) => {
    const href = await Document.getPortalUrl(persistence, entity, instance);

    const resource = warpjsUtils.createResource(href, {
        type: instance.type,
        typeLabel: entity.getDomain().getEntityLabelByEntityName(instance.type),
        id: instance.id,
        name: instance.Name,
        label: entity.getDisplayName(instance)
    });

    const previewHref = RoutesInfo.expand(routes.portal.preview, {
        type: instance.type,
        id: instance.id
    });
    resource.link('preview', previewHref);

    const overview = await overviewByEntity(persistence, entity, instance);
    const paragraphs = overview && overview._embedded ? overview._embedded.items : null;
    const paragraph = paragraphs && paragraphs.length ? paragraphs[0] : null;
    const description = paragraph ? paragraph.description : null;
    if (description) {
        resource.description = description;
    }

    const previewImageUrl = await previewImageByEntity(persistence, entity, instance);
    if (previewImageUrl) {
        resource.link('image', previewImageUrl);
    }

    // External link?
    // FIXME: Use the BasicProperty
    if (instance.RemoteMoreLink) {
        resource.link('remoteMoreLink', {
            title: "External Link",
            href: instance.RemoteMoreLink
        });
    }

    return resource;
};
