const Promise = require('bluebird');
const warpjsUtils = require('@warp-works/warpjs-utils');

const allDocuments = require('./all-documents');
const constants = require('./../../edition/constants');
const Orphans = require('./orphans');
const serverUtils = require('./../../utils');
const utils = require('./../utils');

module.exports = (req, res) => {
    const { domain } = req.params;

    const resource = warpjsUtils.createResource(req, {
        title: `List of orphans for domain ${domain}`,
        domain
    });

    warpjsUtils.wrapWith406(res, {
        html: () => Promise.resolve()
            .then(() => utils.basicRender(constants.getBundles('orphans'), resource, req, res))
            .catch((err) => {
                console.error(`Error generating HTML:`, err);
            }),

        [warpjsUtils.constants.HAL_CONTENT_TYPE]: () => Promise.resolve()
            .then(() => serverUtils.getPersistence(domain))
            .then((persistence) => Promise.resolve()
                .then(() => serverUtils.getDomain(domain))
                .then((domainModel) => Promise.resolve()
                    .then(() => serverUtils.getDomain(domain))
                    .then((domainModel) => allDocuments(persistence, domainModel))
                    .then((documents) => new Orphans(domainModel, documents))
                    .then((orphans) => resource.embed('orphans', orphans.toHAL()))
                )
            )
            .then(() => utils.sendHal(req, res, resource))
            .catch((err) => {
                console.error(`Error list orphans:`, err);
            })
    });
};
