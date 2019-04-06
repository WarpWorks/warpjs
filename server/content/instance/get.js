const ChangeLogs = require('@warp-works/warpjs-change-logs');
// const debug = require('debug')('W2:content:instance/get');
const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const constants = require('./../constants');
const editionInstance = require('./../../edition/instance');
const serverUtils = require('./../../utils');
const studioRoutes = require('./../../studio/constants').routes;
const utils = require('./../utils');

const config = serverUtils.getConfig();

function breadcrumbMapper(domain, breadcrumb) {
    const url = RoutesInfo.expand(constants.routes.instance, {
        domain,
        type: breadcrumb.type,
        id: breadcrumb.id
    });
    const resource = warpjsUtils.createResource(url, breadcrumb);

    resource._links.self.title = breadcrumb.Name || breadcrumb.name || breadcrumb.type;

    resource.link('instances', {
        href: RoutesInfo.expand(constants.routes.instances, { domain, type: breadcrumb.type }),
        title: `Documents of type '${breadcrumb.type}'.`
    });

    return resource;
}

module.exports = async (req, res) => {
    const { domain, type, id } = req.params;

    const resource = warpjsUtils.createResource(req, {
        title: `Domain ${domain} - Type ${type} - Id ${id}`,
        domain,
        type,
        id,
        _meta: {
            editable: true
        },
        customMessages: {}
    });

    resource.link('preview', RoutesInfo.expand('entity', {
        type,
        id
    }));
    resource.link('sibling', RoutesInfo.expand(constants.routes.sibling, {
        domain,
        type,
        id
    }));
    resource.link('types', RoutesInfo.expand(constants.routes.entities, {
        domain,
        profile: 'linkable'
    }));

    res.format({
        html: () => utils.basicRender(editionInstance.bundles, resource, req, res),

        [warpjsUtils.constants.HAL_CONTENT_TYPE]: async () => {
            const persistence = await serverUtils.getPersistence(domain);
            try {
                const entity = await serverUtils.getEntity(domain, type);

                // FIXME: to studio only if admin.
                resource.link('studio', {
                    href: RoutesInfo.expand(studioRoutes.instance, {
                        domain,
                        type: entity.type,
                        id: entity.persistenceId
                    }),
                    title: "Edit schema in Studio"
                });

                let instance;

                try {
                    instance = await entity.getInstance(persistence, id);
                } catch (err) {
                    // Document not found.
                    resource.notFound = true;
                    // FIXME: This doesn't work because the referrer to
                    // this JSON is the HTML (which is the same URL).
                    // if (req.headers.referer) {
                    //     resource.link('referrer', req.headers.referer);
                    // }
                }

                resource.displayName = entity.getDisplayName(instance);
                resource.isRootInstance = instance.isRootInstance;
                resource.status = instance.Status;

                // Custom messages
                resource.customMessages = await warpjsUtils.server.getCustomMessagesByPrefix(persistence, config, entity.getDomain(), 'Content');

                // Changelogs
                const changeLogs = await ChangeLogs.toFormResource(
                    instance,
                    domain,
                    persistence,
                    constants.routes.instance,
                    entity.getDomain().getEntityByName('User') // FIXME: Hard-coded
                );
                resource.embed('changeLogs', changeLogs);

                // History link.
                resource.link('history', {
                    title: "History",
                    href: RoutesInfo.expand(constants.routes.history, {
                        domain,
                        type,
                        id
                    })
                });

                // can edit the page?
                resource.canEdit = await serverUtils.canEdit(persistence, entity, instance, req.warpjsUser);

                // Breadcrumbs
                const breadcrumbs = await entity.getInstancePath(persistence, instance);
                resource.embed('breadcrumbs', breadcrumbs.map(breadcrumbMapper.bind(null, domain)));

                // Get the form resource
                const pageViewEntity = entity.getPageView(config.views.content);
                const formResource = await pageViewEntity.toFormResource(persistence, instance, [], {
                    domain,
                    type,
                    id,
                    href: resource._links.self.href
                });
                resource.embed('formResources', formResource);

                await utils.sendHal(req, res, resource);
            } catch (err) {
                await utils.sendErrorHal(req, res, resource, err);
            } finally {
                persistence.close();
            }
        }
    });
};
