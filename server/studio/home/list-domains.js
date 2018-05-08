const Promise = require('bluebird');
const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const ComplexTypes = require('./../../../lib/core/complex-types');
const editionConstants = require('./../../edition/constants');
const mapStudioDomain = require('./map-studio-domain');
const utils = require('./../utils');
const warpCore = require('./../../../lib/core');

module.exports = (req, res) => {
    const resource = warpjsUtils.createResource(req, {
        title: "WarpJS domain list"
    });

    warpjsUtils.wrapWith406(res, {
        html: () => utils.basicRender(
            [
                `${RoutesInfo.expand('W2:app:static')}/app/${editionConstants.assets.vendor}`,
                `${RoutesInfo.expand('W2:app:static')}/app/${editionConstants.assets.domains}`
            ],
            resource, req, res
        ),

        [warpjsUtils.constants.HAL_CONTENT_TYPE]: () => Promise.resolve()
            .then(() => warpCore.getPersistence())
            .then((persistence) => Promise.resolve()
                .then(() => utils.getEntity(persistence, ComplexTypes.Domain))
                .then((entity) => entity.getDocuments(persistence))
                .then((documents) => documents.map((doc) => mapStudioDomain(doc)))
                .then((domains) => resource.embed('domains', domains))
                .then(() => utils.sendHal(req, res, resource))
                .finally(() => persistence.close())
            )
    });
};
