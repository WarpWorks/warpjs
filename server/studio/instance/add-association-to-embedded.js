const Promise = require('bluebird');
const warpjsUtils = require('@warp-works/warpjs-utils');

const DocLevel = require('./../../../lib/doc-level');
const utils = require('./../utils');
const warpCore = require('./../../../lib/core');

module.exports = (req, res) => {
    const { domain, type, id } = req.params;
    const { body } = req;

    const resource = warpjsUtils.createResource(req, {
        title: `New association for embedded ${domain} - ${type} - ${id}`,
        domain,
        type,
        id
    });

    return Promise.resolve()
        .then(() => {
            // TODO: logger
        })
        .then(() => warpCore.getPersistence())
        .then((persistence) => Promise.resolve()
            .then(() => utils.getInstance(persistence, type, id))
            .then((instanceData) => Promise.resolve()
                .then(() => {
                    if (!instanceData || !instanceData.entity || !instanceData.instance) {
                        throw new Error(`Unable to find '${type}/${id}'.`);
                    }
                })

                .then(() => {
                    if (body.docLevel && body.type && body.id) {
                        return Promise.resolve()
                            .then(() => DocLevel.fromString(body.docLevel))
                            .then((docLevel) => docLevel.getData(persistence, instanceData.entity, instanceData.instance))
                            .then((docLevelData) => docLevelData.model.addValue(persistence, body.type, body.id, docLevelData.instance))
                            .then(() => {
                                // TODO: Changelog
                            })
                            .then(() => instanceData.entity.updateDocument(persistence, instanceData.instance))
                            .then(() => {
                                // TODO: logger
                            })
                        ;
                    } else {
                        throw new Error(`Missing payload.`);
                    }
                })
            )
            .finally(() => persistence.close())
        )
        .then(() => utils.sendHal(req, res, resource))
        .catch((err) => {
            console.error(`Error adding association to embedded. err=`, err);
            utils.sendErrorHal(req, res, resource, err);
        })
    ;
};
