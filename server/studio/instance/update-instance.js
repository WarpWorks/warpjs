// const debug = require('debug')('W2:studio:server/studio/instance/update-instance');
const Promise = require('bluebird');
const warpjsUtils = require('@warp-works/warpjs-utils');

const ComplexTypes = require('./../../../lib/core/complex-types');
const DocLevel = require('./../../../lib/doc-level');
const utils = require('./../utils');
const warpCore = require('./../../../lib/core');

module.exports = (req, res) => {
    const { domain, type, id } = req.params;
    const { body } = req;

    // console.log(`PATCH(): domain=${domain}, type=${type}, id=${id}, body=`, body);

    return Promise.resolve()
        .then(() => warpCore.getPersistence())
        .then((persistence) => Promise.resolve()
            .then(() => utils.getInstance(persistence, type, id))
            .then((instanceData) => Promise.resolve()
                // TODO: Add logger

                .then(() => DocLevel.fromString(body.updatePath))
                .then((docLevel) => {
                    if (body && body.patchAction && body.patchAction === 'remove') { // FIXME: Use a constant.
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

                    // TODO: Add logger
                    // TODO: Add ChangeLogs

                    // FIXME: assume "admin" so allow can update.
                    .then(() => instanceData.entity.updateDocument(persistence, instanceData.instance))
                )
            )
            .then(() => res.status(204).send())
            .finally(() => persistence.close())
        )
        .catch((err) => {
            console.error(`update-instance(): ERROR: err=r`, err);
            // TODO: Add logger
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
