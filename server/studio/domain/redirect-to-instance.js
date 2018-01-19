const Promise = require('bluebird');
const RoutesInfo = require('@quoin/expressjs-routes-info');

const constants = require('./../constants');
const utils = require('./../utils');
const warpCore = require('./../../../lib/core');

module.exports = (req, res) => {
    const { domain } = req.params;

    Promise.resolve()
        .then(() => warpCore.getPersistence())
        .then((persistence) => Promise.resolve()
            .then(() => utils.getDomains(persistence))
            .then((domainsInfo) => domainsInfo.instances.find((instance) => instance.name === domain))
            .then((domainInstance) => {
                if (!domainInstance) {
                    res.status(404).send(`Unknown domain '${domain}'!`);
                } else {
                    const href = RoutesInfo.expand(constants.routes.instance, {
                        domain,
                        type: domainInstance.type,
                        id: domainInstance.id
                    });
                    res.redirect(href);
                }
            })
            .finally(() => persistence.close())
        )
    ;
};
