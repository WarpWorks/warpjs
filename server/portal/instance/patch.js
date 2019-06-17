const ChangeLogs = require('@warp-works/warpjs-change-logs');
const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

// const debug = require('./debug')('patch');
const serverUtils = require('./../../utils');

const ATTRIBUTE_TO_PROPERTY_NAME = Object.freeze({
    name: 'Name',
    description: 'Description',
    keywords: 'Keywords',
    author: 'Author'
});

module.exports = async (req, res) => {
    const { type, id } = req.params;
    const { body } = req;

    const resource = warpjsUtils.createResource(req, {
        type,
        id,
        description: "Updating basic property",
        body
    });

    const persistence = await serverUtils.getPersistence();
    try {
        const entity = await serverUtils.getEntity(null, type);
        const instance = await entity.getInstance(persistence, id);

        const propertyName = ATTRIBUTE_TO_PROPERTY_NAME[body.key];
        if (!propertyName) {
            throw new Error(`Unsupported key='${body.key}'.`);
        }

        const property = entity.getBasicPropertyByName(propertyName);
        if (!property) {
            throw new Error(`Property '${propertyName}' not on '${entity.name}'.`);
        }

        const changeset = await property.setValue(instance, body.value || '');

        ChangeLogs.add(ChangeLogs.ACTIONS.UPDATE_VALUE, req.warpjsUser, instance, {
            key: `Basic:${propertyName}`,
            ...changeset
        });

        await entity.updateDocument(persistence, instance);
        warpjsUtils.sendHal(req, res, resource, RoutesInfo);
    } catch (err) {
        warpjsUtils.sendErrorHal(req, res, resource, err, RoutesInfo);
    } finally {
        persistence.close();
    }
};
