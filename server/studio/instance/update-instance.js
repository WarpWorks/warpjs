const ChangeLogs = require('@warp-works/warpjs-change-logs');
// const debug = require('debug')('W2:studio:server/studio/instance/update-instance');
const Promise = require('bluebird');
const warpjsUtils = require('@warp-works/warpjs-utils');

const ComplexTypes = require('./../../../lib/core/complex-types');
const DocLevel = require('./../../../lib/doc-level');
const logger = require('./../../loggers');
const utils = require('./../utils');
const warpCore = require('./../../../lib/core');

module.exports = (req, res) => {
    const { domain, type, id } = req.params;
    const { body } = req;

    // console.log(`PATCH(): domain=${domain}, type=${type}, id=${id}, body=`, body);

    const deleteAssociation = Boolean(body && body.patchAction && body.patchAction === 'remove'); // FIXME: Use a constant.
    const ACTION = deleteAssociation ? ChangeLogs.ACTIONS.ASSOCIATION_REMOVED : ChangeLogs.ACTIONS.UPDATE_VALUE;

    return Promise.resolve()
        .then(() => logger(req, `Trying ${ACTION}`, body))
        .then(() => warpCore.getPersistence())
        .then((persistence) => Promise.resolve()
            .then(() => utils.getInstance(persistence, type, id))
            .then((instanceData) => Promise.resolve()
                .then(() => DocLevel.fromString(body.updatePath))
                .then((docLevel) => {
                    if (deleteAssociation) {
                        return Promise.resolve()
                            .then(() => docLevel.getData(persistence, instanceData.entity, instanceData.instance, 1))
                            .then((docLevelData) => {
                                if (docLevelData.model.type === ComplexTypes.Relationship && docLevelData.instance.type === ComplexTypes.RelationshipPanelItem) {
                                    // We should not delete this.
                                    throw new Error(`Unexpected delete of a relationship of a relationship-panel-item.`);
                                } else {
                                    throw new Error(`TODO: See what is this case!`);
                                }
                            })
                        ;
                    } else {
                        return Promise.resolve()
                            .then(() => docLevel.getData(persistence, instanceData.entity, instanceData.instance))
                            .then((docLevelData) => docLevelData.model.setValue(docLevelData.instance, body.updateValue))
                        ;
                    }
                })
                .then((updateData) => Promise.resolve()
                    .then(() => {
                        // console.log("updateData=", updateData);
                        // console.log("instanceData.instance=", instanceData.instance);
                    })
                    .then(() => logger(req, `Success ${ACTION}`, {
                        docLevel: body.updatePath,
                        newValue: updateData.newValue,
                        oldValue: updateData.oldValue
                    }))
                    .then(() => ChangeLogs.add(ChangeLogs.ACTIONS.UPDATE_VALUE, req.warpjsUser, instanceData.instance, {
                        key: body.updatePath,
                        oldValue: updateData.oldValue,
                        newValue: updateData.newValue
                    }))

                    // FIXME: assume "admin" so allow can update.
                    .then(() => instanceData.entity.updateDocument(persistence, instanceData.instance, false))
                )
            )
            .then(() => warpCore.removeDomainFromCache(domain))
            .then(() => res.status(204).send())
            .finally(() => persistence.close())
        )
        .catch((err) => {
            // eslint-disable-next-line no-console
            console.error(`update-instance(): ERROR: err=r`, err);
            logger(req, `Failed ${ACTION}`, { err });
            const resource = warpjsUtils.createResource(req, {
                domain,
                type,
                id,
                body: req.body
            });
            utils.sendErrorHal(req, res, resource, err);
        })
    ;
};
