const ChangeLogs = require('@warp-works/warpjs-change-logs');
// const debug = require('debug')('W2:studio:instance/remove-element');
const Promise = require('bluebird');
const warpjsUtils = require('@warp-works/warpjs-utils');

const DocLevel = require('./../../../lib/doc-level');
// const logger = require('./../../loggers');
const utils = require('./../utils');
const warpCore = require('./../../../lib/core');

module.exports = (req, res) => {
    const { domain, type, id } = req.params;
    const { body } = req;

    const resource = warpjsUtils.createResource(req, {
        title: `Remove element from ${domain} - ${type} - ${id}`,
        domain,
        type,
        id
    });

    // debug(`domain=${domain}; type=${type}; id=${id}`);
    // debug(`body=`, body);

    return Promise.resolve()
        .then(() => {
            // TODO: logger
        })
        .then(() => warpCore.getPersistence())
        .then((persistence) => Promise.resolve()
            .then(() => utils.getInstance(persistence, type, id))
            .then((instanceData) => {
                if (body.docLevel) {
                    // Removing a child element.
                    const docLevel = DocLevel.fromString(body.docLevel);

                    return Promise.resolve()
                        .then(() => docLevel.getData(persistence, instanceData.entity, instanceData.instance, 1))
                        .then((docLevelData) => {
                            // debug(`docLevelData=`, docLevelData);

                            const targetEntity = docLevelData.model.getTargetEntity();

                            // debug(`targetEntity=`, targetEntity);

                            if (targetEntity.isDocument()) {
                                const lastDocLevel = docLevel.last();
                                // debug(`lastDocLevel=`, lastDocLevel);
                                return Promise.resolve()
                                    .then(() => targetEntity.removeDocument(persistence, lastDocLevel.value))
                                    .then(() => {
                                        // TODO: logger
                                    })
                                ;
                            } else {
                                throw new Error(`TODO: Implement removing embedded.`);
                            }
                        })
                    ;
                } else {
                    // Remove the element itself.
                    return Promise.resolve()
                        .then(() => instanceData.entity.getParentData(persistence, instanceData.instance))
                        .then((parentData) => {
                            if (parentData) {
                                return Promise.resolve()
                                    .then(() => ChangeLogs.add(ChangeLogs.ACTIONS.AGGREGATION_REMOVED, req.warpjsUser, parentData.instance, {
                                        key: instanceData.instance.parentRelnName,
                                        label: instanceData.entity.getDisplayName(instanceData.instance),
                                        type: instanceData.instance.type,
                                        id: instanceData.instance.id
                                    }))
                                    .then(() => parentData.entity.updateDocument(persistence, parentData.instance, true))
                                ;
                            }
                        })
                        .then(() => instanceData.entity.removeDocument(persistence, instanceData.instance))
                    ;
                }
            })
            .finally(() => persistence.close())
        )
        .then(() => utils.sendHal(req, res, resource))
        .catch((err) => {
            // eslint-disable-next-line no-console
            console.error(`Error removing element. err=`, err);
            utils.sendErrorHal(req, res, resource, err);
        })
    ;
};
