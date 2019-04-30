const warpjsUtils = require('@warp-works/warpjs-utils');

const serverUtils = require('./../../utils');
const utils = require('./../utils');

module.exports = (req, res) => {
    const { domain, type, id, name } = req.params;
    const { body } = req;

    warpjsUtils.wrapWith406(res, {
        [warpjsUtils.constants.HAL_CONTENT_TYPE]: async () => {
            if (body && body.length) {
                const persistence = serverUtils.getPersistence(domain);

                try {
                    const entity = await serverUtils.getEntity(domain, type);
                    const instance = await entity.getInstance(persistence, id);
                    const relationship = entity.getRelationshipByName(name);

                    const refs = relationship.getTargetReferences(instance);

                    body.forEach((refToChange) => {
                        const foundRef = refs.find((ref) => ref.type === refToChange.type && ref._id === refToChange.id);
                        if (foundRef) {
                            foundRef.position = refToChange.relnPosition;
                        }
                    });

                    // FIXME: Add to History.
                    await entity.updateDocument(persistence, instance, true);

                    res.status(204).send();
                } catch (err) {
                    // eslint-disable-next-line no-console
                    console.error("reorder ERROR: err=", err);
                    const resource = warpjsUtils.createResource(req, {
                        domain,
                        type,
                        id,
                        name,
                        body
                    });
                    utils.sendErrorHal(req, res, resource, err);
                } finally {
                    persistence.close();
                }
            } else {
                const resource = warpjsUtils.createResource(req, {
                    domain,
                    type,
                    id,
                    name,
                    body,
                    message: "No payload or empty list"
                });
                utils.sendHal(req, res, resource);
            }
        }
    });
};
