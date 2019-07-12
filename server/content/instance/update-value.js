const ChangeLogs = require('@warp-works/warpjs-change-logs');
// const debug = require('debug')('W2:content:instance:update-value');
const Promise = require('bluebird');
const warpjsUtils = require('@warp-works/warpjs-utils');

const logger = require('./../../loggers');
const search = require('./../../../lib/search');
const serverUtils = require('./../../utils');
const utils = require('./../utils');

module.exports = (req, res, persistence, entity, instance) => {
    const { domain, type, id } = req.params;
    const { body } = req;

    // debug(`body=`, body);

    const resource = warpjsUtils.createResource(req, {
        title: `WarpJS Content: Update '${domain}/${type}/${id}'`,
        domain,
        type,
        id
    });

    const deleteAssociation = Boolean(body && body.patchAction && body.patchAction === 'remove');

    const action = deleteAssociation ? ChangeLogs.ACTIONS.ASSOCIATION_REMOVED : ChangeLogs.ACTIONS.UPDATE_VALUE;
    const patchAction = deleteAssociation ? [ body.patchAction, body.type, body.id ].join(':') : null;

    if (body.field) {
        body.updatePath += `.Field:${body.field}`;
    }

    return Promise.resolve()
        .then(() => logger(req, `Trying ${action}`, body))
        .then(() => serverUtils.canEdit(persistence, entity, instance, req.warpjsUser))
        .then((canEdit) => {
            if (!canEdit) {
                throw new warpjsUtils.WarpJSError(`Do not have write permission`);
            }
        })
        .then(() => entity.patch(body.updatePath, 0, instance, body.updateValue, patchAction))
        .then((valueInfo) => {
            logger(req, `Success ${action}`, {
                updatePath: body.updatePath,
                newValue: valueInfo.newValue,
                oldValue: valueInfo.oldValue
            });
            ChangeLogs.add(ChangeLogs.ACTIONS.UPDATE_VALUE, req.warpjsUser, instance, {
                key: body.updatePath,
                oldValue: valueInfo.oldValue,
                newValue: valueInfo.newValue
            });
        })
        .then(() => entity.updateDocument(persistence, instance, true))
        .then(() => search.indexDocument(persistence, entity, instance))
        .then(() => res.status(204).send())
        .catch((err) => {
            // eslint-disable-next-line no-console
            console.error("updateValue(): ERROR: err=", err);
            logger(req, `Failed ${action}`, { err });
            utils.sendErrorHal(req, res, resource, err);
        })
    ;
};
