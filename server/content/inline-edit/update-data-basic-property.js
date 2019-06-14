const ChangeLogs = require('@warp-works/warpjs-change-logs');

// const debug = require('./debug')('update-data-basic-property');

module.exports = async (persistence, entity, instance, body, req) => {
    const basicProperty = entity.getBasicPropertyById(body.reference.id);

    await ChangeLogs.add(ChangeLogs.ACTIONS.UPDATE_VALUE, req.warpjsUser, instance, {
        key: body.field,
        oldValue: basicProperty.getValue(instance),
        newValue: body.newValue
    });

    return basicProperty.setValue(instance, body.newValue);
};
