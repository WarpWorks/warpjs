// const debug = require('debug')('W2:studio:remove-relationship');
const Promise = require('bluebird');
const warpjsUtils = require('@warp-works/warpjs-utils');

const DocLevel = require('./../../../lib/doc-level');
const utils = require('./../utils');
const warpCore = require('./../../../lib/core');

module.exports = (req, res) => {
    const { domain, type, id, relationship } = req.params;
    const { body } = req;

    const resource = warpjsUtils.createResource(req, {
        title: `Remove child for relationship ${domain} - ${type} - ${id} - ${relationship}`,
        domain,
        type,
        id,
        relationship
    });

    return Promise.resolve()
        .then(() => {
            // TODO: add logger
        })
        .then(() => warpCore.getPersistence())
        .then((persistence) => Promise.resolve()
            .then(() => utils.getInstance(persistence, type, id))
            .then((instanceData) => Promise.resolve()
                .then(() => DocLevel.fromString(body.docLevel))
                .then((docLevel) => docLevel.getData(persistence, instanceData.entity, instanceData.instance, 1))
                .then((docLevelData) => Promise.resolve()
                    .then(() => docLevelData.model.getTargetReferences(docLevelData.instance))
                    .then((references) => {
                        const first = docLevelData.docLevel.first();
                        if (first) {
                            const { value } = first;
                            const indexOf = references.findIndex((ref) => ref._id === value);
                            if (indexOf !== -1) {
                                references.splice(indexOf, 1);
                                return instanceData.entity.updateDocument(persistence, instanceData.instance);
                            }
                        }
                    })
                )
            )
            .finally(() => persistence.close())
        )
        .then(() => utils.sendHal(req, res, resource))
        .catch((err) => {
            console.error(`Error removing relationship child. err=`, err);
            utils.sendErrorHal(req, res, resource, err);
        })
    ;
};
