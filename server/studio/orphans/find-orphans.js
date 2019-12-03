const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const ComplexTypes = require('./../../../lib/core/complex-types');
const { routes } = require('./../constants');
const Domain = require('./../../../lib/core/models/domain');
const editionConstants = require('./../../edition/constants');
const warpCore = require('./../../../lib/core');
const utils = require('./../utils');

const Orphans = require('./orphans');

module.exports = (req, res) => {
    const { domain } = req.params;

    const resource = warpjsUtils.createResource(req, {
        domain,
        title: "Domain schema warnings"
    });

    resource.link('domain', {
        href: RoutesInfo.expand(routes.entities, { domain }),
        title: domain
    });

    warpjsUtils.wrapWith406(res, {
        html: () => utils.basicRender(editionConstants.getBundles(editionConstants.entryPoints.orphans), resource, req, res),

        [warpjsUtils.constants.HAL_CONTENT_TYPE]: async () => {
            const persistence = warpCore.getPersistence();

            try {
                const coreDomain = warpCore.getCoreDomain();
                const domainEntity = coreDomain.getEntityByName(ComplexTypes.Domain);

                const documents = await domainEntity.getDocuments(persistence, { name: domain });
                const domainJSON = documents && documents.length ? documents[0] : {};

                const domainInstance = new Domain(warpCore, domainJSON.name, domainJSON.desc, false);
                await domainInstance.fromPersistenceJSON(persistence, domainJSON);

                const orphans = new Orphans(domainInstance);

                resource.embed('orphans', orphans.toHAL());

                utils.sendHal(req, res, resource);
            } catch (err) {
                // eslint-disable-next-line no-console
                console.error("*** ERROR studio/orphans/find-orphans ***", err);
                utils.sendErrorHal(req, res, resource, err);
            } finally {
                persistence.close();
            }
        }
    });
};
