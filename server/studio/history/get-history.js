const ChangeLogs = require('@warp-works/warpjs-change-logs');
// const debug = require('debug')('W2:studio:history/get-history');
const Promise = require('bluebird');
const warpjsUtils = require('@warp-works/warpjs-utils');

const { routes } = require('./../constants');
const utils = require('./../utils');
const warpCore = require('./../../../lib/core');

module.exports = (req, res) => {
    const { domain, type, id } = req.params;

    const resource = warpjsUtils.createResource(req, {
        title: `WarpJS Studio: History of '${domain}/${type}/${id}`,
        domain,
        type,
        id
    });

    warpjsUtils.wrapWith406(res, {
        [warpjsUtils.constants.HAL_CONTENT_TYPE]: () => Promise.resolve()
            .then(() => warpCore.getPersistence())
            .then((persistence) => Promise.resolve()
                .then(() => utils.getInstance(persistence, type, id))
                .then((instanceData) => Promise.resolve()
                    .then(() => warpCore.getDomainByName(domain))
                    .then((domainEntity) => domainEntity.getEntityByName('User')) // FIXME: Hard-coded
                    .then((userEntity) => ChangeLogs.toFormResource(instanceData.instance, domain, persistence, routes.instance, userEntity))
                )
                .then((changeLogs) => resource.embed('changeLogs', changeLogs))
                .finally(() => persistence.close())
            )
            .then(() => utils.sendHal(req, res, resource))
            .catch((err) => utils.sendErrorHal(req, res, resource, err))
    });
};
