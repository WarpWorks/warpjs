const Promise = require('bluebird');
const warpjsUtils = require('@warp-works/warpjs-utils');

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
                .then(() => {
                    if (!instanceData || !instanceData.entity || !instanceData.instance) {
                        throw new Error(`Unable to find '${type}/${id}'.`);
                    }
                })

                // TODO: Add logger

                .then(() => DocLevel.fromString(body.updatePath))
                .then((docLevel) => docLevel.getData(persistence, instanceData.entity, instanceData.instance))
                .then((docLevelData) => docLevelData.model.setValue(docLevelData.instance, body.updateValue))
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
