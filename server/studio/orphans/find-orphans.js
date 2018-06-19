const Promise = require('bluebird');
const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const ComplexTypes = require('./../../../lib/core/complex-types');
const { routes } = require('./../constants');
const Domain = require('./../../../lib/core/models/domain');
const Orphans = require('./orphans');
const editionConstants = require('./../../edition/constants');
const warpCore = require('./../../../lib/core');
const utils = require('./../utils');

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

        [warpjsUtils.constants.HAL_CONTENT_TYPE]: () => Promise.resolve()
            .then(() => warpCore.getPersistence())
            .then((persistence) => Promise.resolve()
                .then(() => warpCore.getCoreDomain())
                .then((coreDomain) => coreDomain.getEntityByName(ComplexTypes.Domain))
                .then((domainEntity) => Promise.resolve()
                    .then(() => domainEntity.getDocuments(persistence, {name: domain}))
                    .then((documents) => documents && documents.length ? documents[0] : {})
                    .then((domainJSON) => Promise.resolve()
                        .then(() => new Domain(warpCore, domainJSON.name, domainJSON.desc, false))
                        .then((domainInstance) => domainInstance.fromPersistenceJSON(persistence, domainJSON))
                        .then((domainInstance) => new Orphans(domainInstance))
                        .then((orphans) => resource.embed('orphans', orphans.toHAL()))
                    )
                )
                .finally(() => persistence.close())
            )
            .then(() => utils.sendHal(req, res, resource))
            .catch((err) => {
                // eslint-disable-next-line no-console
                console.error("*** ERROR studio/orphans/find-orphans ***", err);
                utils.sendErrorHal(req, res, resource, err);
            })
    });
};
